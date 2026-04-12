"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Beaker } from "lucide-react";
import { api } from "@/lib";
import { toast } from "sonner";

const requiredFields = [
  "N",
  "P",
  "K",
  "pH",
  "EC",
  "OC",
  "S",
  "Zn",
  "Fe",
  "Cu",
  "Mn",
  "B",
];

type SoilFormType = Record<
  (typeof requiredFields)[number] | "fertility_class" | "confidence",
  string
>;

export default function SoilHealthView() {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<SoilFormType>>({});

  useEffect(() => {
    fetchExisting();
  }, []);

  const fetchExisting = async () => {
    try {
      const data = await api("api/farmer/soil").post();
      if (data) setFormData(data);
    } catch {
      console.warn("No previous soil analysis found.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const missingFields = requiredFields.filter(
      (key) => !formData[key] || isNaN(parseFloat(formData[key]!)),
    );
    if (missingFields.length > 0) {
      toast.error(
        `Please fill all chemical parameters: ${missingFields.join(", ")}`,
      );
      return;
    }

    setLoading(true);
    try {
      const payload = Object.fromEntries(
        requiredFields.map((key) => [key, parseFloat(formData[key]!)]),
      );
      const result = await api("api/farmer/soil", payload).post();
      if (result) {
        setFormData((prev) => ({ ...prev, ...result }));
        toast.success("Soil Analysis Complete!");
      }
    } catch (err: unknown) {
      toast.error(
        (err as Error).message || "Analysis failed to reach laboratory API",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Soil Health Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Analyze soil chemistry for fertility classification and yield
          predictions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-blue-600" />
              Chemical Parameters
            </CardTitle>
            <CardDescription>
              Enter soil test results for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {requiredFields.map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="text-xs font-semibold uppercase">
                    {key}
                  </Label>
                  <Input
                    name={key}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData[key] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Analyzing..." : "Perform Analysis"}
            </Button>
          </CardContent>
        </Card>

        {formData.fertility_class && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">
                Fertility Classification
              </CardTitle>
              <CardDescription className="text-green-700">
                Analysis results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-green-600">
                {formData.fertility_class}
              </div>
              {formData.confidence && (
                <p className="text-sm text-green-700">
                  Confidence:{" "}
                  {(parseFloat(formData.confidence) * 100).toFixed(1)}%
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
