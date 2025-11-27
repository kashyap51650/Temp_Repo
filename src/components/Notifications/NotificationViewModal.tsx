import { Badge, Button } from "@/components/atoms";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { NotificationRow } from "@/components/organisms/DataTable/tableData";

interface NotificationViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: NotificationRow | null;
}

export function NotificationViewModal({
  open,
  onOpenChange,
  notification,
}: NotificationViewModalProps) {
  const notificationDetails = notification
    ? [
        {
          label: "Title :",
          value: notification.title,
        },
        {
          label: "Sent To :",
          value: (
            <div className="flex flex-wrap gap-2 justify-end">
              {notification.sentTo.map((s) => (
                <Badge key={s} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          ),
        },
        {
          label: "Sent By :",
          value: notification.sentBy,
        },
        {
          label: "Date :",
          value: notification.date,
        },
        {
          label: "Type :",
          value: (
            <div className="flex flex-wrap gap-2 justify-end">
              {notification.type.map((t) => (
                <Badge key={t} variant={"secondary"} className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          ),
        },
        {
          label: "Recipients :",
          value: notification.recipients,
        },
        {
          label: "Status :",
          value: (
            <Badge
              variant={
                notification.status === "Delivered" ? "default" : "secondary"
              }
              className={
                notification.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-muted mb-1 text-sm font-medium text-muted-foreground w-30"
              }
            >
              {notification.status}
            </Badge>
          ),
        },
      ]
    : [];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={"Notification Details"}
      trigger={null}
    >
      <div>
        {notification ? (
          <div className="flex gap-4 flex-col mt-5">
            {notificationDetails.map(({ label, value }) => (
              <div className="flex justify-between items-start" key={label}>
                <div className="mb-1 text-sm font-medium text-muted-foreground w-30">
                  {label}
                </div>
                <div className="font-normal ml-4 text-sm text-end">{value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm">No notification selected.</div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            size={"lg"}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default NotificationViewModal;
