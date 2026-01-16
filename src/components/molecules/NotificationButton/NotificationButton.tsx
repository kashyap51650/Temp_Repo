import { Bell } from "lucide-react";

import { Badge } from "@/components/atoms";
import { Button } from "@/components/atoms/Button/Button";

interface NotificationButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export function NotificationButton({
  unreadCount,
  onClick,
}: Readonly<NotificationButtonProps>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative size-9"
      onClick={onClick}
    >
      <Bell className="size-4" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs font-medium flex items-center justify-center"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
