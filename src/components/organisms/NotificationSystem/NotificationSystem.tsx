import { NotificationButton } from "@/components/molecules/NotificationButton/NotificationButton";
import { NotificationDrawer } from "@/components/organisms/NotificationDrawer/NotificationDrawer";
import { useNotifications } from "@/contexts/NotificationContext";

export function NotificationSystem() {
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
      <NotificationButton unreadCount={unreadCount} onClick={openDrawer} />
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
