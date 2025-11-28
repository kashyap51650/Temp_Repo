import { Camera, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
import { useProfile } from "@/hooks";

export function ProfileSettings() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<
    File | undefined
  >(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setAvatarUrl(profile.profile_picture || undefined);
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.warn(file);

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setProfilePictureFile(file);

      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!firstName.trim() || !lastName.trim()) {
        toast.error("First name and last name are required");
        return;
      }

      const profileData = {
        first_name: firstName,
        last_name: lastName,
        ...(profilePictureFile && { profile_picture: profilePictureFile }),
      };

      await updateProfile(profileData);

      toast.success("Profile updated successfully");
      setProfilePictureFile(undefined);
    } catch (error: any) {
      console.error("Profile update error:", error);

      const errorMessage =
        error?.details?.message || error?.message || "Failed to update profile";

      if (error?.status === 500) {
        console.error("Server error details:", {
          status: error.status,
          details: error.details,
          message: error.message,
        });
        toast.error(`Server error (500): ${errorMessage}`);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const getAvatarFallback = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return firstInitial + lastInitial || "U";
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading profile...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                  {getAvatarFallback()}
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
              onChange={handleFileChange}
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
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              size="lg"
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              size="lg"
              placeholder="Enter last name"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={profile?.email || ""}
              size="lg"
              disabled
              className="bg-muted"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg" onClick={handleUpdateProfile} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
}
