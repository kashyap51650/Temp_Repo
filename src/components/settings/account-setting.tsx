import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
} from "@/components/atoms";
import { useUserNotificationSetting } from "@/hooks/useUserNotificationSetting";

export function AccountActions() {
  const {
    notificationSetting,
    updateNotificationSetting,
    isLoading,
    isUpdating,
  } = useUserNotificationSetting();

  const handleNotificationSettingToggle = ({
    checked,
  }: {
    checked: boolean;
  }) => {
    updateNotificationSetting({ validate_notification: checked });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Account Actions</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Account management and security actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Notification Setting */}
        <div className="flex items-center justify-between border border-gray-100 p-3 rounded-xl">
          <div className="flex-1">
            <Label
              htmlFor="notification-switch"
              className="font-medium text-base cursor-pointer"
            >
              Validate Notification
            </Label>
            <div className="text-muted-foreground text-sm">
              Receive notifications for data validation activities
            </div>
          </div>
          <Switch
            id="notification-switch"
            checked={notificationSetting}
            onCheckedChange={(checked) =>
              handleNotificationSettingToggle({ checked })
            }
            disabled={isLoading || isUpdating}
            aria-label="Toggle validation notifications"
          />
        </div>
      </CardContent>
    </Card>
  );
}
