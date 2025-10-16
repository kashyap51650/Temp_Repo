import { Camera, User } from "lucide-react";
import { useRef, useState } from "react";

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

export function ProfileSettings() {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
            <Input
              id="full-name"
              defaultValue="John Smith"
              size="lg"
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="Enter email address"
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
  );
}
