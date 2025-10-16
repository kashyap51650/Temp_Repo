import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Camera, Lock, LogOut, User } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/atoms";
import { AvatarFallback, AvatarImage } from "@/components/atoms/Avatar/Avatar";
import { PasswordFields } from "@/components/molecules/PasswordFields";
import { Form } from "@/components/organisms/Form/Form";

export default function SettingsPage() {
  // Password form schema
  const passwordSchema = z
    .object({
      current: z.string().min(1, "Current password is required"),
      new: z.string().min(6, "New password must be at least 6 characters"),
      confirm: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.new === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  type PasswordFormValues = z.infer<typeof passwordSchema>;

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });
  const [loading, setLoading] = useState(false);

  // Avatar upload state
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handlePasswordSubmit = async (_data: PasswordFormValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      passwordForm.reset();
    }, 1200);
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle className="text-xl">Profile Settings</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Update your personal information and display picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20">
              <Avatar className="w-20 h-20 border">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-xl font-semibold">
                    AU
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="flex-1">
              <Label className="mb-2">Display Picture</Label>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setAvatarUrl(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
                Change Picture
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" defaultValue="John Smith" size="lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                defaultValue="john.smith@oranomed.com"
                size="lg"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button size={"lg"}>Update Profile</Button>
        </CardFooter>
      </Card>

      {/* Password Settings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <CardTitle className="text-xl">Password Settings</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Change your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-6"
            >
              {/* Password fields using shadcn/ui form context */}
              <PasswordFields showCurrent showConfirm />
              <Button type="submit" size={"lg"} disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Account Actions */}
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

      {/* System Information */}
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
                <span className="text-sm text-muted-foreground">
                  Last Login:
                </span>
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
    </div>
  );
}
