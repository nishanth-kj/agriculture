"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  RefreshCw,
  Package,
  MapPin,
  TrendingUp,
  Wallet,
  Boxes,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import {
  ApiResponsePayload,
  InventoryItem,
  InventoryFormData,
  InventoryApiItem,
  Pagination
} from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge/StatusBadge";
import { api, STATUS } from "@/lib";
import { PaginationModel } from "@/lib/models/pagination.model";
import { toast } from "sonner";

export default function InventoryView() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationModel>(new PaginationModel());
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<InventoryFormData>({
    name: "",
    category: "",
    quantity: "",
    unit: "units",
  });

  const fetchData = useCallback(async (page?: number, size?: number, sortOrder?: string, sortBy?: string) => {
    setLoading(true);
    try {
      const resp = await api("api/farmer/inventory", {
        pageNumber: page ?? pagination.page,
        size: size ?? pagination.size,
        sortOrder: sortOrder ?? pagination.sortOrder,
        sortBy: sortBy ?? pagination.sortBy,
      }).post() as ApiResponsePayload<{ items: InventoryApiItem[], pagination: Pagination }>;

      if (!resp.data?.items) {
        setData([]);
        return;
      }

      const mapped: InventoryItem[] = resp.data.items.map((item: InventoryApiItem) => ({
        id: String(item.id),
        name: item.name,
        category: item.location || "General",
        quantity: item.quantity,
        unit: "units",
        status: item.status,
        createdAt: new Date(item.createdAt * 1000),
      }));

      setData(mapped);
      if (resp.data.pagination) {
        setPagination(prev => prev.clone().updateFromResponse(resp.data.pagination!));
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, [pagination.page,
  pagination.size,
  pagination.sortBy,
  pagination.sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData,refreshKey]); // Remove fetchData from deps to avoid loop weight

  const handlePaginationChange = (page: number, size: number, sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    void fetchData(page, size, sortOrder, sortBy);
  };

  const handleInputChange = (field: keyof InventoryFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.quantity) {
      toast.error("Fill required fields");
      return;
    }

    setIsSaving(true);
    try {
      await api("api/farmer/inventory", {
        name: formData.name,
        quantity: Number(formData.quantity),
        location: formData.category,
        cost: 0,
        sellingPrice: 0,
      }).post();

      toast.success("Inventory added");
      setRefreshKey(prev => prev + 1);
      setIsDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "units",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await api("api/farmer/inventory", {
        id: parseInt(id),
        status: STATUS.INACTIVE.code,
      }).post();

      toast.success("Deleted");
      setRefreshKey(prev => prev + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const columns = useMemo<Column<InventoryItem>[]>(() => [
    {
      key: "name",
      header: "Asset Name",
      sortable: true,
      searchable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      )
    },
    {
      key: "category",
      header: "Location",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <MapPin className="h-3 w-3" />
          {row.category}
        </div>
      )
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (row) => (
        <span className="font-semibold">{row.quantity} <span className="text-[10px] text-muted-foreground uppercase">{row.unit}</span></span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        if (row.status === STATUS.ACTIVE.code) return <StatusBadge label="Active" variant="success" />;
        if (row.status === STATUS.INACTIVE.code) return <StatusBadge label="Inactive" variant="danger" />;
        return <StatusBadge label="Unknown" variant="neutral" />;
      },
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            setItemToDelete(row.id);
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
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track strategic assets, hardware, and logistics across sectors.</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Asset
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
          { label: "Total Assets", val: pagination.total, icon: Boxes },
          { label: "Active Items", val: data.filter(i => i.status === STATUS.ACTIVE.code).length, icon: TrendingUp },
          { label: "Sectors", val: new Set(data.map(i => i.category)).size, icon: MapPin },
          { label: "Stock Value", val: "₹---", icon: Wallet },
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
          <CardTitle className="text-lg">Resource Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            keyExtractor={(row) => row.id}
            loading={loading}
            manualPagination={true}
            totalRecords={pagination.total}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Provision New Asset</DialogTitle>
            <DialogDescription>
              Enter the details for the new agricultural resource.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Asset Designation</Label>
              <Input
                id="name"
                placeholder="e.g. Tractor Model X"
                value={formData.name}
                onChange={e => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Sector/Location</Label>
                <Input
                  id="category"
                  placeholder="e.g. North Field"
                  value={formData.category}
                  onChange={e => handleInputChange("category", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={e => handleInputChange("quantity", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the resource as inactive. It will remain in history but will be removed from active logistics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (itemToDelete) handleDelete(itemToDelete);
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