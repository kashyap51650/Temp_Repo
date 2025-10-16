import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";

export function AccountActions() {
  const navigate = useNavigate();
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Account Actions</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Account management and security actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between border border-gray-100 p-3 rounded-xl">
          <div>
            <div className="font-medium text-base">Sign Out</div>
            <div className="text-muted-foreground text-sm">
              Sign out of your account on this device
            </div>
          </div>
          <Button
            variant="outline"
            size={"default"}
            onClick={() => navigate({ to: "/auth/login" })}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
