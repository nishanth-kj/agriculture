import { RoleStat } from "./role-stat.type";

export interface AdminDashboardProps {
    stats: {
        totalUsers: number;
        totalValuation: number;
        systemStatus: string;
        roleDistribution: RoleStat[];
    }
}
