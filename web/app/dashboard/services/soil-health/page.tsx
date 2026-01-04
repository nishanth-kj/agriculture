// FRONTEND: app/services/soil-health/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const requiredFields = [
  'N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B'
];

type SoilFormType = Record<typeof requiredFields[number] | 'fertilityClass' | 'confidence', string>;

export default function SoilHealthPage() {
  const [formData, setFormData] = useState<Partial<SoilFormType>>({});
  const [loading, setLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await fetch('/api/soil', { credentials: 'include' });
        const result = await res.json();
        if (result.status === 1 && result.data) {
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

      // Call Next.js API which handles Python API call and database save
      const response = await fetch('/api/soil', {
        method: isExisting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.status === 1) {
        const { fertility_class, confidence } = result.data;

        setFormData((prev) => ({
          ...prev,
          fertilityClass: fertility_class,
          confidence: confidence.toString(),
        }));

        toast.success('✅ Prediction successful!');
        setIsExisting(true);
      } else {
        toast.error(result.message || '❌ Failed to get prediction');
        console.error(result);
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