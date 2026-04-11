"use client"

import { api, GROWTH_STAGES, WEATHER_OPTIONS, CROPS } from '@/lib';
import { PestFormData, PestPredictionResult } from '@/types';
import { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge';
import { FaNotesMedical, FaTractor, FaSync } from 'react-icons/fa';

const symptoms = [
  'Yellow Leaves',
  'Stunted Growth',
  'Wilting',
  'Fruit Rot',
  'Leaf Spots',
  'Holes in Leaves',
  'Powdery Mildew',
  'Root Rot'
];

export default function PestPredictionForm() {
  const [formData, setFormData] = useState<PestFormData>({
    message: '',
    cropType: '',
    location: '',
    observedSymptoms: '',
    growthStage: '',
    weather: ''
  })
  const [prediction, setPrediction] = useState<PestPredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: PestFormData) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const payload = {
        ...formData,
        observedSymptoms: formData.observedSymptoms.split(',').map((s: string) => s.trim())
      };

      const data = await api('/prediction/pest-predict/', payload).post();
      if (data) {
        setPrediction(data as PestPredictionResult);
      }

    } catch (err: unknown) {
      setError((err as Error).message || 'Prediction error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-center uppercase tracking-tight">🐛 Pest Prediction</h1>
      <p className="text-slate-500 mb-8 text-center font-medium">Identify likely pests affecting your crops.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl shadow-lg border">
        {/* Crop & Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Crop Type*</Label>
            <Select
              value={formData.cropType}
              onValueChange={(value: string) => setFormData((prev: PestFormData) => ({ ...prev, cropType: value }))}
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
            <Label className="mb-2 block">Location*</Label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Village or District"
            />
          </div>
        </div>

        {/* Growth & Weather */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Growth Stage</Label>
            <Select
              value={formData.growthStage}
              onValueChange={(value: string) => setFormData((prev: PestFormData) => ({ ...prev, growthStage: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Stage" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GROWTH_STAGES).map((stage) => (
                  <SelectItem key={stage.code} value={stage.value.toLowerCase()}>{stage.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Weather</Label>
            <Select
              value={formData.weather}
              onValueChange={(value: string) => setFormData((prev: PestFormData) => ({ ...prev, weather: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Weather" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(WEATHER_OPTIONS).map((w) => (
                  <SelectItem key={w.code} value={w.value.toLowerCase()}>{w.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problem & Symptoms */}
        <div>
          <Label className="mb-2 block">Problem Description*</Label>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder="Briefly describe what you're seeing on the crop"
            required
          />
        </div>

        <div>
          <Label className="mb-2 block">Observed Symptoms</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {symptoms.map((s: string) => (
              <Badge
                key={s}
                variant={formData.observedSymptoms.includes(s) ? 'default' : 'outline'}
                className="cursor-pointer rounded-full px-4 py-1 font-bold transition-all"
                onClick={() => setFormData((prev: PestFormData) => ({
                  ...prev,
                  observedSymptoms: prev.observedSymptoms.includes(s)
                    ? prev.observedSymptoms.split(', ').filter((item: string) => item !== s).join(', ')
                    : prev.observedSymptoms ? `${prev.observedSymptoms}, ${s}` : s
                }))}
              >
                {s}
              </Badge>
            ))}
          </div>
          <Input
            type="text"
            name="observedSymptoms"
            value={formData.observedSymptoms}
            onChange={handleChange}
            placeholder="e.g., yellow leaves, stunted growth (comma separated)"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
          {loading ? 'Predicting...' : 'Predict Pest'}
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {prediction && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border transition-all">
          <h2 className="text-2xl font-bold mb-4 text-emerald-700 flex items-center gap-2">
            <FaSync className="animate-pulse" /> PREDICTION RESULT
          </h2>

          <div className="mb-4">
            <h3 className="font-semibold text-slate-700">Identified Pest:</h3>
            <p className="whitespace-pre-line text-lg font-bold">{prediction.prediction}</p>
            <Badge variant="secondary" className="mt-2 rounded-full">Confidence: {prediction.confidenceLevel}</Badge>
          </div>

          {prediction.preventionMethods && prediction.preventionMethods.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-700 mb-2">Prevention Methods:</h3>
              <ul className="space-y-2">
                {prediction.preventionMethods.map((method: string, i: number) => (
                  <li key={i} className="flex gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 items-start">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">{method}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {prediction.treatmentOptions && prediction.treatmentOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-700 mb-2">Treatment Options:</h3>
              <ul className="space-y-2">
                {prediction.treatmentOptions.map((opt: string, i: number) => (
                  <li key={i} className="flex gap-4 p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 items-start">
                    <FaTractor className="text-sky-500 mt-1 flex-shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">{opt}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {prediction.relatedPests && prediction.relatedPests.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Related Pests:</h3>
              <div className="flex flex-wrap gap-2">
                {prediction.relatedPests.map((p: string, i: number) => (
                  <Badge key={i} className="bg-red-500/10 text-red-600 border-red-500/20 rounded-full py-1 px-4 font-bold flex gap-2 items-center">
                    <FaNotesMedical /> {p}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

