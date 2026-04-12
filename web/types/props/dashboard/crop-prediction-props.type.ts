import type { Dispatch, FormEvent, SetStateAction } from "react";
import { SoilHealthInput, PredictionResponse } from "@/types";

type CropPredictionFormData = {
  crop: string;
  season: string;
  state: string;
  area_hectares: number;
};

type OptionMap = Record<string, { code: string; value: string }>;

export interface CropPredictionViewProps {
  soilData: SoilHealthInput | null;
  loading: boolean;
  result: PredictionResponse | null;
  manualQuestion: string;
  setManualQuestion: (val: string) => void;
  formData: CropPredictionFormData;
  setFormData: Dispatch<SetStateAction<CropPredictionFormData>>;
  handleSubmit: (e: FormEvent) => void;
  CROPS: OptionMap;
  STATES: OptionMap;
  SEASONS: OptionMap;
}
