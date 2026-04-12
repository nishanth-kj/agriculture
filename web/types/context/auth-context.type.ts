import { User } from "@/types";
import { LoginPayload, RegisterPayload } from "@/types";
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}
