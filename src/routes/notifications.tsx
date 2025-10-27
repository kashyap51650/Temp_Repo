import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules";
import {
  CreateNotification,
  NotificationHistory,
  NotificationTemplates,
} from "@/components/Notifications";

export const Route = createFileRoute("/notifications")({
  component: NotificationsComponent,
});

function NotificationsComponent() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-black">Notifications</h1>
        <p className="text-gray-600 mb-0">
          Manage and send notifications to users
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="create">Create Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <CreateNotification />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <NotificationHistory />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <NotificationTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
}
