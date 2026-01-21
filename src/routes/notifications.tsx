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
import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

export const Route = createFileRoute("/notifications")({
  component: () => (
    <ProtectedRoute
      permissions={[
        PERMISSIONS.NOTIFICATIONS.SEND,
        PERMISSIONS.NOTIFICATIONS.VIEW_HISTORY,
        PERMISSIONS.NOTIFICATIONS.VIEW_TEMPLATES,
      ]}
      mode="any"
    >
      <NotificationsComponent />
    </ProtectedRoute>
  ),
});

function NotificationsComponent() {
  const { hasPermission } = usePermissions();

  const canSendNotification = hasPermission(PERMISSIONS.NOTIFICATIONS.SEND);
  const canViewHistory = hasPermission(PERMISSIONS.NOTIFICATIONS.VIEW_HISTORY);
  const canViewTemplates = hasPermission(
    PERMISSIONS.NOTIFICATIONS.VIEW_TEMPLATES
  );

  const getDefaultTab = () => {
    if (canSendNotification) return "create";
    if (canViewHistory) return "history";
    if (canViewTemplates) return "templates";
    return "create";
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  // Note: visibleTabsCount will never be 0 because ProtectedRoute will only render this component if have at least one Permission
  const visibleTabsCount = [
    canSendNotification,
    canViewHistory,
    canViewTemplates,
  ].filter(Boolean).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-black">Notifications</h1>
        <p className="text-gray-600 mb-0">
          Manage and send notifications to users
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className="grid"
          style={{ gridTemplateColumns: `repeat(${visibleTabsCount}, 1fr)` }}
        >
          {canSendNotification && (
            <TabsTrigger value="create">Create Notification</TabsTrigger>
          )}
          {canViewHistory && (
            <TabsTrigger value="history">Notification History</TabsTrigger>
          )}
          {canViewTemplates && (
            <TabsTrigger value="templates">Templates</TabsTrigger>
          )}
        </TabsList>

        {canSendNotification && (
          <TabsContent value="create" className="mt-6">
            <CreateNotification />
          </TabsContent>
        )}

        {canViewHistory && (
          <TabsContent value="history" className="mt-6">
            <NotificationHistory />
          </TabsContent>
        )}

        {canViewTemplates && (
          <TabsContent value="templates" className="mt-6">
            <NotificationTemplates />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
