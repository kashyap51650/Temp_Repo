import { AccountActions } from "@/components/settings/account-setting";
import { PasswordSettings } from "@/components/settings/password-settings";
import { ProfileSettings } from "@/components/settings/profile-settings";

export default function SettingsPage() {
  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <ProfileSettings />
      <PasswordSettings />
      <AccountActions />
    </div>
  );
}
