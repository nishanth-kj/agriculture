"use client";

import {
  ResourceManagement,
} from "@/components/common/ResourceManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { api, STATUS, RESOURCE_TYPE } from "@/lib";
import { 
  ManagingPageProps, 
  ApiResponsePayload, 
  Pagination,
  Resource,
  InventoryApiItem,
  WorkerApiItem
} from "@/types";
import { toast } from "sonner";

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  size: 10,
  total: 0,
  totalPages: 0,
};

export default function ManagingView({
  initialTab = "inventory",
  hideTabs = false,
}: ManagingPageProps) {
  // Inventory State
  const [inventoryData, setInventoryData] = useState<Resource[]>([]);
  const [invPagination, setInvPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [invLoading, setInvLoading] = useState(true);

  // Labour State
  const [labourData, setLabourData] = useState<Resource[]>([]);
  const [labPagination, setLabPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [labLoading, setLabLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Data Fetching
   */
  const fetchInventory = useCallback(async () => {
    setInvLoading(true);
    try {
      const resp = await api("api/farmer/inventory", {
        page: invPagination.page,
        size: invPagination.size
      }).post() as ApiResponsePayload<InventoryApiItem[]>;
      
      const mapped: Resource[] = resp.data.map(item => ({
        id: String(item.id),
        name: item.name,
        type: RESOURCE_TYPE.INVENTORY.code,
        category: item.location || "General",
        quantity: item.quantity,
        unit: "nos",
        status: item.status,
        createdAt: new Date(item.createdAt * 1000)
      }));
      
      setInventoryData(mapped);
      if (resp.pagination) setInvPagination(resp.pagination);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch inventory");
    } finally {
      setInvLoading(false);
    }
  }, [invPagination.page, invPagination.size]);

  const fetchLabour = useCallback(async () => {
    setLabLoading(true);
    try {
      const resp = await api("api/admin/workers", {
        page: labPagination.page,
        size: labPagination.size
      }).post() as ApiResponsePayload<WorkerApiItem[]>;
      
      const mapped: Resource[] = resp.data.map(item => ({
        id: String(item.id),
        name: item.user?.name || "Worker",
        type: RESOURCE_TYPE.LABOUR.code,
        category: item.farm || "General",
        quantity: 1,
        unit: "person",
        status: item.status,
        description: item.role,
        createdAt: new Date()
      }));
      
      setLabourData(mapped);
      if (resp.pagination) setLabPagination(resp.pagination);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch labour force");
    } finally {
      setLabLoading(false);
    }
  }, [labPagination.page, labPagination.size]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory, refreshKey]);

  useEffect(() => {
    fetchLabour();
  }, [fetchLabour, refreshKey]);

  /**
   * Action Handlers
   */
  const handleSaveInventory = async (resource: Omit<Resource, "id" | "createdAt">) => {
    await api("api/farmer/inventory", {
      name: resource.name,
      quantity: resource.quantity,
      location: resource.category,
      cost: 0,
      sellingPrice: 0
    }).post();
    setRefreshKey(prev => prev + 1);
  };

  const handleDeleteInventory = async (id: string) => {
    await api("api/farmer/inventory", {
      id: parseInt(id),
      status: STATUS.INACTIVE.code
    }).post();
    setRefreshKey(prev => prev + 1);
  };

  const handleSaveLabour = async (resource: Omit<Resource, "id" | "createdAt">) => {
    const slug = resource.name.toLowerCase().replace(/\s+/g, '.');
    await api("api/admin/workers", {
      name: resource.name,
      email: `${slug}@farm.com`,
      username: slug,
      farm: resource.category,
      role: resource.description || "General Worker"
    }).post();
    setRefreshKey(prev => prev + 1);
  };

  const handleDeleteLabour = async (id: string) => {
    await api("api/admin/workers", {
      id: parseInt(id),
      status: STATUS.INACTIVE.code
    }).post();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {!hideTabs && (
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic px-1">
            Resource Management
          </h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
            Global Asset & Workforce Control Terminal
          </p>
        </div>
      )}

      <Tabs defaultValue={initialTab} className="w-full">
        {!hideTabs && (
          <TabsList className="grid grid-cols-2 w-full max-w-md bg-muted/50 p-1 rounded-2xl h-14">
            <TabsTrigger
              value="inventory"
              className="gap-2 font-black uppercase text-[10px] tracking-widest rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg"
            >
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="labour"
              className="gap-2 font-black uppercase text-[10px] tracking-widest rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg"
            >
              <Users className="h-4 w-4" />
              Workforce
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="inventory" className="space-y-4 mt-6">
          <ResourceManagement
            type={RESOURCE_TYPE.INVENTORY.code}
            title="Strategic Inventory"
            description="Hardware, chemicals, and consumable logistics tracking."
            initialData={inventoryData}
            loading={invLoading}
            pagination={invPagination}
            onPaginationChange={setInvPagination}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
            onSave={handleSaveInventory}
            onDelete={handleDeleteInventory}
          />
        </TabsContent>

        <TabsContent value="labour" className="space-y-4 mt-6">
          <ResourceManagement
            type={RESOURCE_TYPE.LABOUR.code}
            title="Workforce Command"
            description="Field operatives, diagnostic staff, and labor allocation."
            initialData={labourData}
            loading={labLoading}
            pagination={labPagination}
            onPaginationChange={setLabPagination}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
            onSave={handleSaveLabour}
            onDelete={handleDeleteLabour}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
