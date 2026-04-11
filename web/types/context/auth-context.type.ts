import { User } from "@/types";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: unknown) => Promise<void>;
  register: (data: unknown) => Promise<void>;
  logout: () => Promise<void>;
}
