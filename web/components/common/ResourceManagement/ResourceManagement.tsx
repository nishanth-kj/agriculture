"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Loader2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, Column } from "@/components/common/DataTable/DataTable";
import { toast } from "sonner";
import { STATUS, RESOURCE_TYPE } from "@/lib";
import { 
  Resource, 
  ResourceManagementProps, 
  ResourceFormData 
} from "@/types";

export function ResourceManagement({
  type,
  title = "Resource Management",
  description = "Manage inventory and labour resources efficiently.",
  onSave,
  onDelete,
  initialData = [],
  loading = false,
  pagination,
  onPaginationChange,
  onRefresh,
}: ResourceManagementProps) {
  const [resources, setResources] = useState<Resource[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ResourceFormData>({
    name: "",
    type: type,
    category: "",
    quantity: "",
    unit: "",
    status: STATUS.ACTIVE.code,
    description: "",
  });

  // Handle local state update if initialData changes
  const displayData = pagination ? initialData : resources.filter((r) => r.type === type);

  // Handle form input changes
  const handleInputChange = (field: keyof ResourceFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Validate form
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.quantity ||
      !formData.unit.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const newResource: Omit<Resource, "id" | "createdAt"> = {
        name: formData.name.trim(),
        type: formData.type,
        category: formData.category.trim(),
        quantity: Number(formData.quantity),
        unit: formData.unit.trim(),
        status: formData.status,
        description: formData.description.trim(),
      };

      // Call onSave callback if provided
      if (onSave) {
        const result = await onSave(newResource);
        if (result && !pagination) {
          setResources((prev) => [result as Resource, ...prev]);
        }
      } else if (!pagination) {
        const resourceWithId: Resource = {
          ...newResource,
          id: `res-${Date.now()}`,
          createdAt: new Date(),
        };
        setResources((prev) => [resourceWithId, ...prev]);
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        type: type,
        category: "",
        quantity: "",
        unit: "",
        status: STATUS.ACTIVE.code,
        description: "",
      });
      setIsDialogOpen(false);
      toast.success("Resource added successfully");
    } catch (error: any) {
      console.error("Error adding resource:", error);
      toast.error(error.message || "Failed to add resource");
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, type, pagination]);

  // Handle resource deletion
  const handleDelete = useCallback(
    async (resourceId: string) => {
      try {
        if (onDelete) {
          await onDelete(resourceId);
        }
        if (!pagination) {
          setResources((prev) => prev.filter((r) => r.id !== resourceId));
        }
        toast.success("Resource deleted successfully");
      } catch (error: any) {
        console.error("Error deleting resource:", error);
        toast.error(error.message || "Failed to delete resource");
      }
    },
    [onDelete, pagination],
  );

  // Table columns
  const columns: Column<Resource>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (row) => (
        <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold tracking-widest uppercase">
          {RESOURCE_TYPE.INVENTORY.code === row.type ? "Inventory" : "Labour"}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      searchable: true,
    },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
      render: (row) => (
        <div className="font-bold">
          {row.quantity} <span className="text-muted-foreground text-[10px] uppercase">{row.unit}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => {
        const isInactive = row.status === STATUS.INACTIVE.code;
        const isPending = row.status === STATUS.PENDING.code;
        
        let colorClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
        let label = "Active";

        if (isInactive) {
          colorClass = "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
          label = "Maintenance";
        } else if (isPending) {
          colorClass = "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
          label = "In Use";
        }

        return (
          <span className={`px-2 py-1 ${colorClass} rounded-full text-[10px] font-bold tracking-widest uppercase`}>
            {label}
          </span>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      searchable: true,
      render: (row) => (
        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
          {row.description || "—"}
        </div>
      ),
    },
    {
      key: "id",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(row.id)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={loading}
              className="rounded-xl h-11 w-11 shadow-sm hover:shadow-md transition-all active:rotate-180 duration-500"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          )}
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 rounded-xl h-11 px-5 font-bold shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      <div className="relative">
        <DataTable<Resource>
          columns={columns}
          data={displayData}
          keyExtractor={(row) => row.id}
          emptyMessage={loading ? "Synchronizing with field terminals..." : `No records found.`}
          pageSize={pagination?.size || 10}
        />
        
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {pagination && onPaginationChange && (
        <div className="flex items-center justify-between px-2 py-4 border-t border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Showing {Math.min(displayData.length, pagination.size)} of {pagination.total} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || loading}
              onClick={() => onPaginationChange({ ...pagination, page: pagination.page - 1 })}
              className="h-9 w-9 p-0 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPaginationChange({ ...pagination, page: pageNum })}
                    className="h-9 w-9 p-0 rounded-lg font-bold"
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => onPaginationChange({ ...pagination, page: pagination.page + 1 })}
              className="h-9 w-9 p-0 rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Provision Resource</DialogTitle>
            <DialogDescription className="font-medium">
              Initialize a new asset or unit into the operational grid.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                Resource Identity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., John Deere 5050D, High-Grade Urea"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="rounded-xl h-12 bg-muted/50 border-none font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                Sector / Category <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                placeholder="e.g., Heavy Machinery, Soil Nutrients"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="rounded-xl h-12 bg-muted/50 border-none font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Volume <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  className="rounded-xl h-12 bg-muted/50 border-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                  Metric <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="unit"
                  placeholder="e.g., KG, NOS, HRS"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="rounded-xl h-12 bg-muted/50 border-none font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                Operational Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={String(formData.status)}
                onValueChange={(value) => handleInputChange("status", parseInt(value))}
              >
                <SelectTrigger id="status" className="rounded-xl h-12 bg-muted/50 border-none font-bold capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value={String(STATUS.ACTIVE.code)} className="font-bold">Active / Available</SelectItem>
                  <SelectItem value={String(STATUS.PENDING.code)} className="font-bold">In Use / Assigned</SelectItem>
                  <SelectItem value={String(STATUS.INACTIVE.code)} className="font-bold">Maintenance / Down</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                Technical Notes
              </Label>
              <Textarea
                id="description"
                placeholder="Diagnostic telemetry, assignment details..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="rounded-xl bg-muted/50 border-none min-h-20 resize-none font-medium text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
              className="rounded-xl font-bold h-12 px-6"
            >
              Abort
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="rounded-xl font-black h-12 px-8 shadow-lg active:scale-95 transition-all"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isSaving ? "SYNCING..." : "COMMIT ASSET"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
