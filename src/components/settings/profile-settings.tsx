import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
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
import { MAX_FILE_SIZE } from "@/lib/constants";
import {
  type ProfileFormDataType,
  profileSchema,
} from "@/schemas/profileSchema";

export function ProfileSettings() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const form = useForm<ProfileFormDataType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePictureFile: undefined,
    },
  });
  const { handleSubmit, setValue } = form;

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setValue("firstName", profile.first_name || "");
      setValue("lastName", profile.last_name || "");
      setAvatarUrl(profile.profile_picture || undefined);
    }
  }, [profile, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setValue("profilePictureFile", file);

      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (values: ProfileFormDataType) => {
    try {
      const profileData = {
        first_name: values.firstName,
        last_name: values.lastName,
        ...(values.profilePictureFile && {
          profile_picture: values.profilePictureFile,
        }),
      };

      await updateProfile(profileData);

      toast.success("Profile updated successfully");
      setValue("profilePictureFile", undefined);
    } catch (error: any) {
      const errorMessage =
        error?.details?.message || error?.message || "Failed to update profile";

      toast.error(errorMessage);
    }
  };

  const getAvatarFallback = () => {
    const { firstName, lastName } = form.getValues();
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return firstInitial + lastInitial || "U";
  };

  const handleError = (errors: FieldErrors<ProfileFormDataType>) => {
    const validationErrors = Object.values(errors)
      .map((val) => val?.message)
      .filter(Boolean);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
    }
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
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: JPG, JPEG, PNG, GIF
              <br />
              Maximum size: 5MB
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  {...field}
                  size="lg"
                  placeholder="Enter first name"
                />
              </div>
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  {...field}
                  size="lg"
                  placeholder="Enter last name"
                />
              </div>
            )}
          />
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
        <Button
          size="lg"
          onClick={handleSubmit(handleUpdateProfile, handleError)}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
}
