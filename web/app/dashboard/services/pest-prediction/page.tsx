"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { GROWTH_STAGES, WEATHER_OPTIONS } from '@/lib/constants';

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
      <h1 className="text-3xl font-bold mb-2 text-center uppercase tracking-tight">🐛 Pest Prediction</h1>
      <p className="text-slate-500 mb-8 text-center font-medium">Identify likely pests affecting your crops.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border">
        {/* Crop & Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Crop Type*</label>
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Crop</option>
              {['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'].map(crop => (
                <option key={crop} value={crop.toLowerCase()}>{crop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
              placeholder="Village or District"
            />
          </div>
        </div>

        {/* Growth & Weather */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Growth Stage</label>
            <select
              name="growthStage"
              value={formData.growthStage}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Stage</option>
              {GROWTH_STAGES.map(stage => (
                <option key={stage} value={stage.toLowerCase()}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Weather</label>
            <select
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Weather</option>
              {WEATHER_OPTIONS.map(w => (
                <option key={w} value={w.toLowerCase()}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem & Symptoms */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Problem Description*</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded-lg"
            placeholder="Briefly describe what you're seeing on the crop"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">Observed Symptoms</label>
          <input
            type="text"
            name="observedSymptoms"
            value={formData.observedSymptoms}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., yellow leaves, stunted growth (comma separated)"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium flex justify-center items-center ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Predict Pest'}
        </button>
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
    </div>
  )
}
