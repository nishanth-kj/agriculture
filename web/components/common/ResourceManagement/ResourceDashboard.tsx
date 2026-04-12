"use client";

import { useState } from "react";
import {
  ResourceManagement,
  Resource,
} from "@/components/common/ResourceManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users } from "lucide-react";

export function ResourceDashboard() {
  const [inventoryData] = useState<Resource[]>([]);
  const [labourData] = useState<Resource[]>([]);

  // Handle saving inventory
  const handleSaveInventory = async (
    resource: Omit<Resource, "id" | "createdAt">,
  ) => {
    // TODO: Make API call to save inventory
    console.log("Saving inventory:", resource);
    // Example: await api("api/inventory").post(resource);
  };

  // Handle deleting inventory
  const handleDeleteInventory = async (resourceId: string) => {
    // TODO: Make API call to delete inventory
    console.log("Deleting inventory:", resourceId);
    // Example: await api(`api/inventory/${resourceId}`).delete();
  };

  // Handle saving labour
  const handleSaveLabour = async (
    resource: Omit<Resource, "id" | "createdAt">,
  ) => {
    // TODO: Make API call to save labour
    console.log("Saving labour:", resource);
    // Example: await api("api/labour").post(resource);
  };

  // Handle deleting labour
  const handleDeleteLabour = async (resourceId: string) => {
    // TODO: Make API call to delete labour
    console.log("Deleting labour:", resourceId);
    // Example: await api(`api/labour/${resourceId}`).delete();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full max-w-md">
          <TabsTrigger value="inventory" className="gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="labour" className="gap-2">
            <Users className="h-4 w-4" />
            Labour
          </TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <ResourceManagement
            type="inventory"
            title="Inventory Management"
            description="Manage farm equipment, seeds, fertilizers, and other inventory items."
            initialData={inventoryData}
            onSave={handleSaveInventory}
            onDelete={handleDeleteInventory}
          />
        </TabsContent>

        {/* Labour Tab */}
        <TabsContent value="labour" className="space-y-4">
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
