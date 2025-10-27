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
}: NotificationButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9"
      onClick={onClick}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs font-medium flex items-center justify-center"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
