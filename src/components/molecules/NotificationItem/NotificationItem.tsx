import { Check } from "lucide-react";

import { Badge, Button } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString();
};

export function NotificationItem({
  notification,
  onMarkAsRead,
}: Readonly<NotificationItemProps>) {
  const { id, title, message, type, isRead, createdAt } = notification;

  return (
    <div
      className={cn(
        "px-6 py-5 border-b border-border last:border-0 transition-colors",
        isRead ? "bg-muted/30" : "bg-background"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 ">
            <h4
              className={cn(
                "font-medium text-sm",
                isRead ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {title}
            </h4>
            <Badge variant={type} className="text-xs">
              {type}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(createdAt)}
            </span>
            {!isRead && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onMarkAsRead(id)}
              >
                <Check className="h-3 w-3 " />
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
