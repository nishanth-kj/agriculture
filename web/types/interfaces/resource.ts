export interface Resource {
  id: string;
  name: string;
  type: number;
  category: string;
  quantity: number;
  unit: string;
  status: number;
  description?: string;
  createdAt: Date;
}
