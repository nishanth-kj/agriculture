import { User } from "./user.type";

/**
 * Worker model for workforce management
 */
export interface Worker {
    id: number;
    role: string;
    farm: string;
    user: User;
}
