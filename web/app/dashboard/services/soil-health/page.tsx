'use client';

import { api } from '@/lib';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { FaFlask, FaVial, FaChartPie, FaHistory, FaLeaf } from 'react-icons/fa';

const requiredFields = [
  'N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B'
];

type SoilFormType = Record<typeof requiredFields[number] | 'fertility_class' | 'confidence', string>;

export default function SoilHealthPage() {
  const [formData, setFormData] = useState<Partial<SoilFormType>>({});
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    fetchExisting();
  }, []);

  const fetchExisting = async () => {
    try {
      // Unified POST-based retrieval (empty body)
      const data = await api('/api/soil').post();
      if (data) {
        setFormData(data);
      }
    } catch {
      console.warn('No previous soil analysis found.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const missingFields = requiredFields.filter(
      (key) => !formData[key] || isNaN(parseFloat(formData[key]!))
    );
    if (missingFields.length > 0) {
      toast.error(`Please fill all chemical parameters: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...Object.fromEntries(requiredFields.map(key => [key, parseFloat(formData[key]!)])),
      };

      // Our backend handles Upsert logic automatically via POST + ID detection
      const result = await api('/api/soil', payload).post();

      if (result) {
        setFormData((prev) => ({
          ...prev,
          ...result,
        }));
        toast.success('Soil Analysis Complete!');
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Analysis failed to reach laboratory API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6 space-y-12 animate-in slide-in-from-bottom-5 duration-700">
      {/* 🧬 Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border border-green-500/20">
          <FaFlask /> Soil Laboratory
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-foreground">Fertility Diagnostics</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg">Input your soil chemical composition to receive AI-powered fertility classification and land yield predictions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 🧪 Input Form (Glassmorphic) */}
        <Card className="lg:col-span-7 p-8 bg-card/40 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12">
            <FaVial size={240} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
            {requiredFields.map((key) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-xs font-bold uppercase tracking-widest px-1 opacity-70 flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-primary rounded-full" /> {key}
                </Label>
                <Input
                  id={key}
                  name={key}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-background/50 border-border/40 focus:border-primary/50 h-11 rounded-xl font-medium"
                  value={formData[key] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-10 h-14 rounded-2xl text-lg font-black bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-xl shadow-green-600/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse"><FaHistory className="animate-spin" /> RUNNING DIAGNOSTICS...</span>
            ) : (
              <span className="flex items-center gap-2 uppercase tracking-widest"><FaChartPie /> Perform Soil Analysis</span>
            )}
          </Button>
        </Card>

        {/* 🌿 Analysis Results */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="p-8 bg-gradient-to-br from-green-600/10 to-emerald-500/20 backdrop-blur-xl border-green-500/20 shadow-2xl rounded-[2.5rem] flex flex-col items-center text-center justify-center min-h-[300px] border-2">
            {formData.fertility_class ? (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className="p-5 bg-green-500 text-white rounded-3xl shadow-2xl shadow-green-500/40 inline-block">
                  <FaLeaf size={48} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-green-600/80 mb-1">AI Classification</p>
                  <h2 className="text-6xl font-black tracking-tighter text-foreground">{formData.fertility_class}</h2>
                </div>
                <div className="bg-background/80 py-3 px-6 rounded-2xl inline-flex items-center gap-2 border border-green-500/10">
                  <span className="text-xs font-bold uppercase opacity-60">Confidence Score:</span>
                  <span className="text-xl font-black text-green-600">{(parseFloat(formData.confidence!) * 100).toFixed(1)}%</span>
                </div>
              </div>
            ) : (
              <div className="opacity-40 space-y-4">
                <FaFlask size={60} className="mx-auto" />
                <p className="text-sm font-bold uppercase tracking-widest">Waiting for Diagnostics...</p>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-xl rounded-3xl">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 opacity-70">
              <FaHistory /> Parameters Reference
            </h3>
            <div className="text-xs leading-relaxed text-muted-foreground space-y-2">
              <p>• <strong>N-P-K:</strong> Primary Macronutrients essential for crop growth.</p>
              <p>• <strong>EC / OC:</strong> Electrical Conductivity and Organic Carbon index.</p>
              <p>• <strong>Micronutrients:</strong> Zinc (Zn), Iron (Fe), Copper (Cu), and Boron (B).</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
