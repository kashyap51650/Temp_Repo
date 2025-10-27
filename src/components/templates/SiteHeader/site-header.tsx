import { Bell } from "lucide-react";

import { Badge, Button } from "@/components/atoms";
import { SidebarTrigger } from "@/components/organisms";
import { NotificationDrawer } from "@/components/organisms/NotificationDrawer/NotificationDrawer";
import { useNotifications } from "@/contexts/NotificationContext";

export function SiteHeader() {
  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    markAsRead,
    markAllAsRead,
    openDrawer,
    closeDrawer,
  } = useNotifications();

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant={"outline"}
              size="icon"
              className="relative"
              onClick={openDrawer}
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell />
              {unreadCount > 0 && (
                <Badge
                  variant={"destructive"}
                  className="absolute -top-1 -right-2 rounded-sm p-0 w-5 h-5 text-xs text-white"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        unreadCount={unreadCount}
      />
    </>
  );
}
