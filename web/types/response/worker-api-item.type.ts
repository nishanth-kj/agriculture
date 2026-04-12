export interface WorkerApiItem {
  id: number;
  farm: string;
  role: string;
  status: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
