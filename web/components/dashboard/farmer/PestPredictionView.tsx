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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bug,Loader2
} from "lucide-react";

const CROPS = {
  RICE: { code: "R", value: "Rice" },
  MAIZE: { code: "M", value: "Maize" },
  WHEAT: { code: "W", value: "Wheat" },
  COTTON: { code: "C", value: "Cotton" },
  SUGARCANE: { code: "S", value: "Sugarcane" },
};

const GROWTH_STAGES = {
  SEEDLING: { code: "SD", value: "Seedling" },
  VEGETATIVE: { code: "VG", value: "Vegetative" },
  FLOWERING: { code: "FL", value: "Flowering" },
  FRUITING: { code: "FR", value: "Fruiting" },
  MATURITY: { code: "MT", value: "Maturity" },
};

const WEATHER_OPTIONS = {
  SUNNY: { code: "SN", value: "Sunny" },
  CLOUDY: { code: "CL", value: "Cloudy" },
  RAINY: { code: "RN", value: "Rainy" },
  HUMID: { code: "HM", value: "Humid" },
};

const SYMPTOMS = [
  "Yellowing",
  "Wilting",
  "Spots",
  "Holes",
  "Mold",
  "Rot",
  "Stunted Growth",
];

interface PestPredictionApiResponse {
  prediction: string;
  confidenceLevel: string;
  treatmentOptions?: string[];
}

export default function PestPredictionView() {
  const [loading, setLoading] = React.useState(false);
  const [prediction, setPrediction] =
    React.useState<PestPredictionApiResponse | null>(null);
  const [formData, setFormData] = React.useState({
    cropType: Object.values(CROPS)[0].value,
    location: "",
    growthStage: Object.values(GROWTH_STAGES)[0].value.toLowerCase(),
    weather: Object.values(WEATHER_OPTIONS)[0].value.toLowerCase(),
    message: "",
    observedSymptoms: [] as string[],
  });

  const toggleSymptom = (s: string) => {
    setFormData((prev) => ({
      ...prev,
      observedSymptoms: prev.observedSymptoms.includes(s)
        ? prev.observedSymptoms.filter((item) => item !== s)
        : [...prev.observedSymptoms, s],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api("/prediction/pest-predict/", {
        crop: formData.cropType,
        location: formData.location,
        stage: formData.growthStage,
        weather: formData.weather,
        symptoms: formData.observedSymptoms.join(", "),
        description: formData.message,
      }).post();
      setPrediction(response as PestPredictionApiResponse);
      toast.success("Pest analysis complete");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reach laboratory";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pest Prediction</h1>
        <p className="text-muted-foreground mt-1">
          Predict potential pest outbreaks and receive prevention protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-600" />
              Pest Analysis Form
            </CardTitle>
            <CardDescription>
              Provide crop and environmental data for pest forecasting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Crop Type
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      setFormData({ ...formData, cropType: v })
                    }
                    defaultValue={formData.cropType}
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
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Growth Stage
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      setFormData({ ...formData, growthStage: v })
                    }
                    defaultValue={formData.growthStage}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GROWTH_STAGES).map((s) => (
                        <SelectItem key={s.code} value={s.value.toLowerCase()}>
                          {s.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Location
                  </Label>
                  <Input
                    placeholder="Field location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    Weather
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      setFormData({ ...formData, weather: v })
                    }
                    defaultValue={formData.weather}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(WEATHER_OPTIONS).map((w) => (
                        <SelectItem key={w.code} value={w.value.toLowerCase()}>
                          {w.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase">
                  Observed Symptoms
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map((s) => (
                    <Badge
                      key={s}
                      variant={
                        formData.observedSymptoms.includes(s)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleSymptom(s)}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase">
                  Description
                </Label>
                <Textarea
                  placeholder="Describe visible anomalies or environmental stressors..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Analyzing..." : "Run Pest Diagnostic"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {prediction && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">Pest Identified</CardTitle>
              <CardDescription className="text-red-700">
                Analysis complete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-red-600">
                {prediction.prediction}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-red-700 font-semibold">
                  Confidence: {prediction.confidenceLevel}
                </p>
                {prediction.treatmentOptions &&
                  prediction.treatmentOptions.length > 0 && (
                    <p className="text-sm text-red-700">
                      {prediction.treatmentOptions[0]}
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
