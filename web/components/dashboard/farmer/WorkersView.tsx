"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  RefreshCw,
  Users,
  Briefcase,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DataTable, Column } from "@/components/common/DataTable/DataTable";
import { api, STATUS, PaginationModel } from "@/lib";
import { 
  WorkerItem, 
  WorkerApiItem, 
  WorkerFormData, 
  ApiResponsePayload,
  Pagination 
} from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge/StatusBadge";
import { toast } from "sonner";

export default function WorkersView() {
  const [data, setData] = useState<WorkerItem[]>([]);
  const [pagination, setPagination] = useState<PaginationModel>(new PaginationModel());
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<WorkerFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    farm: "",
    role: "",
  });

  const fetchWorkers = useCallback(async (page?: number, size?: number, sortOrder?: string, sortBy?: string) => {
    setLoading(true);
    try {
      const resp = await api("api/admin/workers", {
        page: page ?? pagination.page,
        size: size ?? pagination.size,
        sortOrder: sortOrder ?? pagination.sortOrder,
        sortBy: sortBy ?? pagination.sortBy,
      }).post() as ApiResponsePayload<{ items: WorkerApiItem[], pagination: Pagination }>;

      if (!resp.data?.items) {
        setData([]);
        return;
      }

      const mapped = resp.data.items.map((item: WorkerApiItem) => ({
        id: String(item.id),
        name: item.user?.name || "Worker",
        farm: item.farm || "General",
        role: item.role,
        status: item.status,
      }));

      setData(mapped);
      if (resp.data.pagination) {
        setPagination(prev => prev.clone().updateFromResponse(resp.data.pagination!));
      }
    } catch (e: unknown) {
      toast.error((e as Error).message || "Failed to fetch workforce");
    } finally {
      setLoading(false);
    }
  }, [pagination.page,
  pagination.size,
  pagination.sortBy,
  pagination.sortOrder]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers,refreshKey]);

  const handlePaginationChange = (page: number, size: number, sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    void fetchWorkers(page, size, sortOrder, sortBy);
  };

  const handleInputChange = (field: keyof WorkerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.username.trim() || !formData.password?.trim() || !formData.farm.trim()) {
      toast.error("Required fields missing (Name, Username, Password, Farm)");
      return;
    }

    setIsSaving(true);
    try {
      await api("api/admin/workers", {
        name: formData.name,
        email: formData.email || undefined,
        username: formData.username,
        password: formData.password,
        farm: formData.farm,
        role: formData.role || "General Worker",
      }).post();

      toast.success("Worker deployed");
      setRefreshKey(prev => prev + 1);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (e: unknown) {
      toast.error((e as Error).message || "Deployment failed");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      farm: "",
      role: "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await api("api/admin/workers", {
        id: parseInt(id),
        status: STATUS.INACTIVE.code,
      }).post();

      toast.success("Worker deactivated");
      setRefreshKey(prev => prev + 1);
    } catch (e: unknown) {
      toast.error((e as Error).message || "Deactivation failed");
    }
  };

  const columns = useMemo<Column<WorkerItem>[]>(() => [
    { 
      key: "name", 
      header: "Operative",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    { 
      key: "farm", 
      header: "Assigned Farm",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <MapPin className="h-3 w-3" />
          {row.farm}
        </div>
      )
    },
    { 
      key: "role", 
      header: "Role",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Briefcase className="h-3 w-3 text-muted-foreground" />
          {row.role}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        r.status === STATUS.ACTIVE.code ? 
        <StatusBadge label="Active" variant="success" /> : 
        <StatusBadge label="Inactive" variant="danger" />
      ),
    },
    {
      key: "id",
      header: "Actions",
      render: (r) => (
        <Button 
          variant="ghost"
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => {
            setWorkerToDelete(r.id);
            setIsDeleteAlertOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
        </Button>
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workforce Command</h1>
          <p className="text-muted-foreground mt-1">Manage field operatives, labor allocation, and assignments.</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Recruit Worker
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Workforce", val: pagination.total, icon: Users },
          { label: "Active Roles", val: data.filter(w => w.status === STATUS.ACTIVE.code).length, icon: Briefcase },
          { label: "Growth Rate", val: "---", icon: TrendingUp },
          { label: "Field Coverage", val: new Set(data.map(w => w.farm)).size, icon: MapPin },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Staff Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={data} 
            keyExtractor={(r) => r.id} 
            loading={loading}
            manualPagination={true}
            totalRecords={pagination.total}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>

      {/* Recruit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if(!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Recruit New Operative</DialogTitle>
            <DialogDescription>
              Register personnel to the farm network.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="worker-name">Full Name</Label>
              <Input 
                id="worker-name"
                placeholder="e.g. John Miller" 
                value={formData.name} 
                onChange={e => handleInputChange("name", e.target.value)} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="worker-username">Username</Label>
              <Input 
                id="worker-username"
                placeholder="j.miller_admin" 
                value={formData.username} 
                onChange={e => handleInputChange("username", e.target.value)} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="worker-email">Email Address (Optional)</Label>
              <Input 
                id="worker-email"
                type="email"
                placeholder="john.m@farm.com" 
                value={formData.email} 
                onChange={e => handleInputChange("email", e.target.value)} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="worker-password">Access Password</Label>
              <Input 
                id="worker-password"
                type="password"
                placeholder="••••••••" 
                value={formData.password} 
                onChange={e => handleInputChange("password", e.target.value)} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="worker-farm">Assigned Farm</Label>
                <Input 
                  id="worker-farm"
                  placeholder="Sector 7" 
                  value={formData.farm} 
                  onChange={e => handleInputChange("farm", e.target.value)} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="worker-role">Specialization</Label>
                <Input 
                  id="worker-role"
                  placeholder="Agronomist" 
                  value={formData.role} 
                  onChange={e => handleInputChange("role", e.target.value)} 
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deploy Operative
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Authorization?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately deactivate the operative`&apos;`s access to farm terminals. History will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (workerToDelete) handleDelete(workerToDelete);
              }}
            >
              Confirm Deactivation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}