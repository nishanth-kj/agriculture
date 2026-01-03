// FRONTEND: app/services/soil-health/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

const requiredFields = [
  'N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B'
];

type SoilFormType = Record<typeof requiredFields[number] | 'fertilityClass' | 'confidence', string>;

export default function SoilHealthPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<SoilFormType>>({});
  const [loading, setLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await fetch('/api/soil', { credentials: 'include' });
        const result = await res.json();
        if (result.success && result.data) {
          setFormData(result.data);
          setIsExisting(true);
        }
      } catch (err) {
        console.error('Failed to load existing soil data:', err);
      }
    };
    fetchExisting();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {

    const missingFields = requiredFields.filter(
      (key) => !formData[key] || isNaN(parseFloat(formData[key]!))
    );
    if (missingFields.length > 0) {
      toast.error(`Please fill all fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {

      const payload = Object.fromEntries(
        requiredFields.map(key => [key, parseFloat(formData[key]!)])
      );

      // 1. Get Prediction
      const prediction = await fetchApi<{ fertility_class: string, confidence: number }>('/soil/predict/', payload, 'POST');


      setFormData((prev) => ({
        ...prev,
        fertilityClass: prediction.fertility_class,
        confidence: prediction.confidence.toString(),
      }));

      // 2. Save to DB (Next.js API route)

      // improved error handling for the local API call as well
      const dbRes = await fetch('/api/soil', {
        method: isExisting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...payload,
          fertilityClass: prediction.fertility_class,
          confidence: prediction.confidence,
        })
      });

      const dbResult = await dbRes.json();


      if (dbRes.ok) {
        toast.success('✅ Data saved successfully');
        setIsExisting(true);
      } else {
        toast.error('❌ Failed to store data');
        console.error(dbResult);
      }

    } catch (err: any) {
      toast.error(err.message || '❌ Server error');
      console.error("🔥 Error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">🧪 Soil Fertility Form</h1>
      <p className="text-slate-500 mb-8 font-medium">Monitor and improve soil health for sustainable farming.</p>
      {formData.fertilityClass && (
        <div className="mt-6 text-lg text-green-700 font-medium">
          🌾 Fertility Class: <strong>{formData.fertilityClass}</strong><br />
          🎯 Confidence: <strong>{formData.confidence}</strong>
        </div>
      )}
      {requiredFields.map((key) => (
        <div key={key} className="mb-4">
          <Label htmlFor={key}>{key}</Label>
          <Input
            id={key}
            name={key}
            type="number"
            step="0.01"
            placeholder={`Enter ${key}`}
            value={formData[key] || ''}
            onChange={handleChange}
          />
        </div>
      ))}
      <Button onClick={handleSubmit} disabled={loading} className="w-full mt-4">
        {loading ? 'Processing...' : isExisting ? 'Update Record' : 'Submit'}
      </Button>
    </div>
  );
}