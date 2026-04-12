"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
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

export interface Resource {
  id: string;
  name: string;
  type: "inventory" | "labour";
  category: string;
  quantity: number;
  unit: string;
  status: "available" | "in-use" | "maintenance";
  description?: string;
  createdAt: Date;
}

interface ResourceManagementProps {
  type: "inventory" | "labour" | "all";
  title?: string;
  description?: string;
  onSave?: (resource: Omit<Resource, "id" | "createdAt">) => Promise<void>;
  onDelete?: (resourceId: string) => Promise<void>;
  initialData?: Resource[];
}

interface FormData {
  name: string;
  type: "inventory" | "labour";
  category: string;
  quantity: string;
  unit: string;
  status: "available" | "in-use" | "maintenance";
  description: string;
}

export function ResourceManagement({
  type = "all",
  title = "Resource Management",
  description = "Manage inventory and labour resources efficiently.",
  onSave,
  onDelete,
  initialData = [],
}: ResourceManagementProps) {
  const [resources, setResources] = useState<Resource[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: type === "all" ? "inventory" : type,
    category: "",
    quantity: "",
    unit: "",
    status: "available",
    description: "",
  });

  // Filter resources based on type
  const filteredResources = resources.filter((resource) =>
    type === "all" ? true : resource.type === type,
  );

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
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

    setIsLoading(true);
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
        await onSave(newResource);
      }

      // Add to local state
      const resourceWithId: Resource = {
        ...newResource,
        id: `res-${Date.now()}`,
        createdAt: new Date(),
      };
      setResources((prev) => [resourceWithId, ...prev]);

      // Reset form and close dialog
      setFormData({
        name: "",
        type: type === "all" ? "inventory" : type,
        category: "",
        quantity: "",
        unit: "",
        status: "available",
        description: "",
      });
      setIsDialogOpen(false);
      toast.success("Resource added successfully");
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error("Failed to add resource");
    } finally {
      setIsLoading(false);
    }
  }, [formData, onSave, type]);

  // Handle resource deletion
  const handleDelete = useCallback(
    async (resourceId: string) => {
      setIsLoading(true);
      try {
        if (onDelete) {
          await onDelete(resourceId);
        }
        setResources((prev) => prev.filter((r) => r.id !== resourceId));
        toast.success("Resource deleted successfully");
      } catch (error) {
        console.error("Error deleting resource:", error);
        toast.error("Failed to delete resource");
      } finally {
        setIsLoading(false);
      }
    },
    [onDelete],
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
        <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
          {row.type}
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
        <div className="font-semibold">
          {row.quantity} {row.unit}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => {
        const statusColors: Record<string, { bg: string; text: string }> = {
          available: { bg: "bg-green-100", text: "text-green-700" },
          "in-use": { bg: "bg-blue-100", text: "text-blue-700" },
          maintenance: { bg: "bg-orange-100", text: "text-orange-700" },
        };
        const colors = statusColors[row.status] || statusColors.available;
        return (
          <span
            className={`capitalize px-2 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-medium`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      searchable: true,
      render: (row) => (
        <div className="text-sm text-muted-foreground line-clamp-2">
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
          disabled={isLoading}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="gap-2 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </Button>
      </div>

      {/* Data Table */}
      <DataTable<Resource>
        columns={columns}
        data={filteredResources}
        keyExtractor={(row) => row.id}
        emptyMessage={`No ${type === "all" ? "resources" : type} found. Add a new one to get started.`}
        pageSize={10}
      />

      {/* Add Resource Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new resource to the system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Resource Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Resource Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Tractor, Fertilizer, Farm Worker"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="rounded-lg h-9"
              />
            </div>

            {/* Type - only show if "all" */}
            {type === "all" && (
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleInputChange("type", value as "inventory" | "labour")
                  }
                >
                  <SelectTrigger id="type" className="rounded-lg h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="labour">Labour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                placeholder="e.g., Equipment, Fertilizer, Staff"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="rounded-lg h-9"
              />
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  className="rounded-lg h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium">
                  Unit <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="unit"
                  placeholder="e.g., kg, nos, hours"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="rounded-lg h-9"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange(
                    "status",
                    value as "available" | "in-use" | "maintenance",
                  )
                }
              >
                <SelectTrigger id="status" className="rounded-lg h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Add any additional notes..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="rounded-lg min-h-20 resize-none"
              />
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="rounded-lg"
            >
              {isLoading ? "Saving..." : "Save Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
