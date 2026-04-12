"use client";

import React from "react";
import { api } from "@/lib";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprout, Loader2 } from "lucide-react";

const CROPS = {
  RICE: { code: "R", value: "Rice" },
  MAIZE: { code: "M", value: "Maize" },
  CHICKPEA: { code: "C", value: "Chickpea" },
  KIDNEYBEANS: { code: "K", value: "Kidneybeans" },
  PIGEONPEAS: { code: "P", value: "Pigeonpeas" },
  MOTHBEANS: { code: "MB", value: "Mothbeans" },
  MUNG_BEAN: { code: "MU", value: "Mung-Bean" },
  BLACKGRAM: { code: "B", value: "Blackgram" },
  LENTIL: { code: "L", value: "Lentil" },
  POMEGRANATE: { code: "PO", value: "Pomegranate" },
  BANANA: { code: "BA", value: "Banana" },
  MANGO: { code: "MA", value: "Mango" },
  GRAPES: { code: "G", value: "Grapes" },
  WATERMELON: { code: "W", value: "Watermelon" },
  MUSKMELON: { code: "MU", value: "Muskmelon" },
  APPLE: { code: "A", value: "Apple" },
  ORANGE: { code: "O", value: "Orange" },
  PAPAYA: { code: "PA", value: "Papaya" },
  COCONUT: { code: "CO", value: "Coconut" },
  COTTON: { code: "CT", value: "Cotton" },
  JUTE: { code: "J", value: "Jute" },
  COFFEE: { code: "CF", value: "Coffee" },
};

interface CropPredictionApiResponse {
  prediction: string | number;
}

export default function CropPredictionView() {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
    crop: Object.values(CROPS)[0].value,
  });
  const [prediction, setPrediction] =
    React.useState<CropPredictionApiResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (val: string) => {
    setFormData((prev) => ({ ...prev, crop: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api("/prediction/predict-yield/", {
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
        crop: formData.crop,
      }).post();
      setPrediction(response as CropPredictionApiResponse);
      toast.success("Yield prediction calculated");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Laboratory connection failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Crop Yield Prediction
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered yield forecasting using soil and climate data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-600" />
              Prediction Parameters
            </CardTitle>
            <CardDescription>
              Input soil and climate data for accurate forecasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Nitrogen (N)
                  </Label>
                  <Input
                    name="N"
                    type="number"
                    step="0.01"
                    placeholder="mg/kg"
                    value={formData.N}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Phosphorus (P)
                  </Label>
                  <Input
                    name="P"
                    type="number"
                    step="0.01"
                    placeholder="mg/kg"
                    value={formData.P}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Potassium (K)
                  </Label>
                  <Input
                    name="K"
                    type="number"
                    step="0.01"
                    placeholder="mg/kg"
                    value={formData.K}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Temperature (°C)
                  </Label>
                  <Input
                    name="temperature"
                    type="number"
                    step="0.01"
                    placeholder="°C"
                    value={formData.temperature}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Humidity (%)
                  </Label>
                  <Input
                    name="humidity"
                    type="number"
                    step="0.01"
                    placeholder="%"
                    value={formData.humidity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Soil pH
                  </Label>
                  <Input
                    name="ph"
                    type="number"
                    step="0.01"
                    placeholder="pH"
                    value={formData.ph}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Rainfall (mm)
                  </Label>
                  <Input
                    name="rainfall"
                    type="number"
                    step="0.01"
                    placeholder="mm"
                    value={formData.rainfall}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase">
                  Target Crop
                </Label>
                <Select
                  onValueChange={handleSelectChange}
                  defaultValue={formData.crop}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CROPS).map((c) => (
                      <SelectItem key={c.code} value={c.value}>
                        {c.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Calculating..." : "Generate Prediction"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {prediction && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Predicted Yield</CardTitle>
              <CardDescription className="text-green-700">
                Based on your input parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-green-600">
                {Number(prediction.prediction).toFixed(2)}
                <span className="text-lg text-green-700 ml-2">kg/acre</span>
              </div>
              <p className="text-sm text-green-700">
                This prediction is based on the soil nutrients and climate
                conditions you provided.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
