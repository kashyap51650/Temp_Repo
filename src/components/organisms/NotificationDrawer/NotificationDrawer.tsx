import { X } from "lucide-react";
import { useState } from "react";

import { Button, Separator } from "@/components/atoms";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/molecules/Drawer/Drawer";
import { NotificationItem } from "@/components/molecules/NotificationItem/NotificationItem";
import type { Notification } from "@/types/notification";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
  widthClass?: string;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  unreadCount,
  widthClass,
}: NotificationDrawerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedNotifications = [...notifications].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = sortedNotifications.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      direction="right"
      className={widthClass ?? "w-4xl max-w-3xl min-w-80"}
    >
      <DrawerContent>
        <div className=" p-0 h-full flex flex-col">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center size-5 text-xs font-medium text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
                    Mark all as read
                  </Button>
                )}

                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notifications available.
              </p>
            ) : (
              <>
                {currentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))}

                {totalPages > 1 && (
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Showing {startIndex + 1}-
                        {Math.min(endIndex, notifications.length)} of{" "}
                        {notifications.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="text-xs">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
