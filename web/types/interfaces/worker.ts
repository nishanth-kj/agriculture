import { User } from "@/types";

/**
 * Worker model for workforce management
 */
export interface Worker {
    id: number;
    role: string;
    farm: string;
    user: User;
}
