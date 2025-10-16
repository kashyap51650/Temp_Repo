import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";

export function SystemInformation() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">System Information</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Current system and account details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Account Type:
              </span>
              <span className="text-sm font-medium">Administrator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Login:</span>
              <span className="text-sm font-medium">2024-01-15 09:30:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Account Created:
              </span>
              <span className="text-sm font-medium">2023-06-15</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Platform Version:
              </span>
              <span className="text-sm font-medium">v2.1.3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Session Timeout:
              </span>
              <span className="text-sm font-medium">8 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Two-Factor Auth:
              </span>
              <span className="text-sm font-medium text-orange-500">
                Not Enabled
              </span>
            </div>
          </div>
        </div>
        <div className="text-center border-t pt-4">
          <Button variant="link">View Full System Status</Button>
        </div>
      </CardContent>
    </Card>
  );
}
