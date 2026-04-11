"use client";

import { api, CROPS, STATES, SEASONS } from '@/lib';
import { SoilHealthInput, PredictionResponse, Crop } from '@/types';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';


export default function CropPredictionPage() {
  const [soilData, setSoilData] = React.useState<SoilHealthInput | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<PredictionResponse | null>(null);
  const [manualQuestion, setManualQuestion] = React.useState('');
  const [formData, setFormData] = React.useState({
    crop: Object.values(CROPS)[0].value,
    season: Object.values(SEASONS)[0].value,
    state: Object.values(STATES)[0].value,
    area_hectares: 1,
  });

  React.useEffect(() => {
    fetchSoilData();
  }, []);

  const fetchSoilData = async () => {
    try {
      // Standardized POST-only retrieval
      const data = await api('/api/soil').post();
      if (data) {
        setSoilData(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading soil data');
    }
  };

  const handleSubmit = async () => {
    if (!soilData) {
      toast.error('❌ No soil data available');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        soil_health: { ...soilData },
        custom_question: manualQuestion.trim(),
      };

      const data = await api('/api/prediction/predict/', payload).post();

      if (data.response) {
        setResult(data);
        toast.success('Prediction successful');
      } else {
        setResult(data);
        toast.success('Response received');
      }

    } catch (err: unknown) {
      console.error(err);
      toast.error((err as Error).message || '❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center uppercase tracking-tight">🌾 Crop Yield AI Recommendation</h1>
      <p className="text-slate-500 mb-8 text-center font-medium">Get precise predictions for crop yields and growth.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label className="mb-2 block">Crop</Label>
          <Select
            value={formData.crop}
            onValueChange={(value) => setFormData({ ...formData, crop: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Crop" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CROPS).map((crop) => (
                <SelectItem key={crop.code} value={crop.value}>{crop.value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">State</Label>
          <Select
            value={formData.state}
            onValueChange={(value) => setFormData({ ...formData, state: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(STATES).map((state) => (
                <SelectItem key={state.code} value={state.value}>{state.value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Season</Label>
          <Select
            value={formData.season}
            onValueChange={(value) => setFormData({ ...formData, season: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SEASONS).map((season) => (
                <SelectItem key={season.code} value={season.value}>{season.value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Area (hectares)</Label>
          <Input
            type="number"
            value={formData.area_hectares}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, area_hectares: Number(e.target.value) })}
            placeholder="e.g. 2.5"
            min={0.1}
            step={0.1}
          />
        </div>
        <div className="md:col-span-2">
          <Label className="mb-2 block">Suggest a Crop (optional)</Label>
          <Input
            type="text"
            list="suggestions"
            placeholder="Try typing Millet, Sunflower..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, crop: e.target.value as Crop })}
          />
          <datalist id="suggestions">
            {Object.values(CROPS).map((item) => (
              <option key={item.value} value={item.value} />
            ))}
          </datalist>
        </div>
        <div className="md:col-span-2">
          <Label className="mb-2 block">Custom Question (optional)</Label>
          <Textarea
            value={manualQuestion}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setManualQuestion(e.target.value)}
            placeholder="e.g. What crop is best for this soil in winter?"
            rows={3}
          />
        </div>
      </div>

      <div className="mb-8">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Predicting...' : 'Get Prediction'}
        </Button>
      </div>

      {soilData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">🧪 Soil Health Data</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
            {Object.entries(soilData).map(([key, value]) => (
              <div key={key} className="p-2 bg-white border rounded shadow-sm text-center">
                <span className="font-semibold">{key}</span>: {value}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* {result && (
        <div className="mt-8 p-4 border rounded bg-green-50 shadow-sm">
          <h2 className="text-xl font-bold mb-3">🌱 Prediction Result</h2>
          <ul className="space-y-2 text-sm">
            {result.yield_per_hectare && (
              <li><strong>Yield per Hectare:</strong> {result.yield_per_hectare}</li>
            )}
            {result.total_yield && (
              <li><strong>Total Yield:</strong> {result.total_yield}</li>
            )}
            {result.profitability && (
              <li><strong>Profitability:</strong> {result.profitability}</li>
            )}
            {result.techniques && (
              <li><strong>Recommended Techniques:</strong> {result.techniques}</li>
            )}
          </ul>
        </div>
      )} */}
      {result?.response && (
        <div className="mt-6 bg-white border border-yellow-300 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl"></span>
            <h2 className="text-xl font-semibold text-yellow-700">AI Prediction Result:</h2>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{result.response}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

