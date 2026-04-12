import type { Dispatch, FormEvent, SetStateAction } from "react";
import { PestPredictionResult } from "@/types";

type PestPredictionFormData = {
  cropType: string;
  location: string;
  growthStage: string;
  weather: string;
  message: string;
  observedSymptoms: string;
};

type OptionMap = Record<string, { code: string; value: string }>;

export interface PestPredictionViewProps {
  prediction: PestPredictionResult | null;
  loading: boolean;
  error: string | null;
  formData: PestPredictionFormData;
  handleChange: (e: FormEvent) => void;
  handleSubmit: (e: FormEvent) => void;
  setFormData: Dispatch<SetStateAction<PestPredictionFormData>>;
  CROPS: OptionMap;
  GROWTH_STAGES: OptionMap;
  WEATHER_OPTIONS: OptionMap;
  symptoms: string[];
}
