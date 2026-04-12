export interface WorkerDashboardProps {
    stats: {
        assignedFarm: string;
        role: string;
        tasksCompleted: number;
        productivityIndex: number;
        joinDate: number;
    }
}
