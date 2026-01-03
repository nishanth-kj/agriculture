"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { GROWTH_STAGES, WEATHER_OPTIONS } from '@/lib/constants';
import { FaBug } from "react-icons/fa";

interface PestFormData {
  message: string;
  cropType: string;
  location: string;
  observedSymptoms: string;
  growthStage: string;
  weather: string;
  [key: string]: string;
}

interface PestPredictionResult {
  prediction: string;
  confidenceLevel: string;
  preventionMethods?: string[];
  treatmentOptions?: string[];
  relatedPests?: string[];
}

export default function PestPredictionForm() {
  const router = useRouter();
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
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const payload = {
        ...formData,
        observedSymptoms: formData.observedSymptoms.split(',').map(s => s.trim())
      };

      const data = await fetchApi<PestPredictionResult>('/prediction/pest-predict/', payload, 'POST');
      if (data) {
        setPrediction(data);
      }

    } catch (err: any) {
      setError(err.message || 'Prediction error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      // ...
      <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2"><FaBug className="text-red-600" /> PEST PREDICTION</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl shadow-lg border">
        {/* Crop & Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Crop Type*</Label>
            <Select
              value={formData.cropType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Crop" />
              </SelectTrigger>
              <SelectContent>
                {['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'].map(crop => (
                  <SelectItem key={crop} value={crop.toLowerCase()}>{crop}</SelectItem>
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
              onValueChange={(value) => setFormData(prev => ({ ...prev, growthStage: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Stage" />
              </SelectTrigger>
              <SelectContent>
                {GROWTH_STAGES.map(stage => (
                  <SelectItem key={stage} value={stage.toLowerCase()}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Weather</Label>
            <Select
              value={formData.weather}
              onValueChange={(value) => setFormData(prev => ({ ...prev, weather: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Weather" />
              </SelectTrigger>
              <SelectContent>
                {WEATHER_OPTIONS.map(w => (
                  <SelectItem key={w} value={w.toLowerCase()}>{w}</SelectItem>
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
          <h2 className="text-2xl font-bold mb-4 text-green-700">PEDICTION RESULT</h2>

          <div className="mb-4">
            <h3 className="font-semibold">Identified Pest:</h3>
            <p className="whitespace-pre-line">{prediction.prediction}</p>
            <p className="text-sm text-gray-600">Confidence: <strong>{prediction.confidenceLevel}</strong></p>
          </div>

          {prediction.preventionMethods && prediction.preventionMethods.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold">Prevention Methods:</h3>
              <ul className="list-disc pl-5">
                {prediction.preventionMethods?.map((method, i) => <li key={i}>{method}</li>)}
              </ul>
            </div>
          )}

          {prediction.treatmentOptions && prediction.treatmentOptions.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold">Treatment Options:</h3>
              <ul className="list-disc pl-5">
                {prediction.treatmentOptions?.map((opt, i) => <li key={i}>{opt}</li>)}
              </ul>
            </div>
          )}

          {prediction.relatedPests && prediction.relatedPests.length > 0 && (
            <div>
              <h3 className="font-semibold">Related Pests:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {prediction.relatedPests?.map((pest, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {pest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <Button
        variant="outline"
        onClick={() => router.push('/services')}
        className="mb-8 gap-2 mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </Button>
    </div>
  )
}
