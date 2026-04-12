"use client";

import {
  ResourceManagement,
  Resource,
} from "@/components/common/ResourceManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users } from "lucide-react";
import { useState } from "react";
import { ManagingPageProps } from "@/types";

export default function ManagingView({
  initialTab = "inventory",
  hideTabs = false,
}: ManagingPageProps) {
  const [inventoryData] = useState<Resource[]>([]);
  const [labourData] = useState<Resource[]>([]);

  const handleSaveInventory = async (
    resource: Omit<Resource, "id" | "createdAt">,
  ) => {
    console.log("Saving inventory:", resource);
  };

  const handleDeleteInventory = async (id: string) => {
    console.log("Deleting inventory:", id);
  };

  const handleSaveLabour = async (
    resource: Omit<Resource, "id" | "createdAt">,
  ) => {
    console.log("Saving labour:", resource);
  };

  const handleDeleteLabour = async (id: string) => {
    console.log("Deleting labour:", id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {!hideTabs && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
            Resource Management
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Manage inventory and labour resources efficiently.
          </p>
        </div>
      )}

      <Tabs defaultValue={initialTab} className="w-full">
        {!hideTabs && (
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger
              value="inventory"
              className="gap-2 font-medium rounded-md"
            >
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="labour"
              className="gap-2 font-medium rounded-md"
            >
              <Users className="h-4 w-4" />
              Labour
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="inventory" className="space-y-4 mt-4">
          <ResourceManagement
            type="inventory"
            title="Inventory Management"
            description="Manage farm equipment, seeds, fertilizers, and other inventory items."
            initialData={inventoryData}
            onSave={handleSaveInventory}
            onDelete={handleDeleteInventory}
          />
        </TabsContent>

        <TabsContent value="labour" className="space-y-4 mt-4">
          <ResourceManagement
            type="labour"
            title="Labour Management"
            description="Manage farm workers and labour resources."
            initialData={labourData}
            onSave={handleSaveLabour}
            onDelete={handleDeleteLabour}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
