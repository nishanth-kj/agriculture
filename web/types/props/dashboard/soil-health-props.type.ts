export interface SoilHealthViewProps {
  formData: Record<string, string | number>;
  loading: boolean;
  requiredFields: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}
