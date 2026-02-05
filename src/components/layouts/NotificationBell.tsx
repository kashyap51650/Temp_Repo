import { Bell } from "lucide-react";
import React from "react";

import { Badge, Button } from "@/components/atoms";
import { useNotifications } from "@/contexts/NotificationContext";

export const NotificationBell: React.FC = () => {
  const { unreadCount, openDrawer } = useNotifications();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openDrawer}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
};
