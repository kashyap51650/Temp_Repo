import { Bell, Mail, Send } from "lucide-react";
import { useState } from "react";

import { Button, Checkbox, Input, Label, Textarea } from "@/components/atoms";

export function CreateNotification() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    roles: {
      administrator: false,
      dataUploader: false,
      dataValidator: false,
      scientist: false,
      researcher: false,
    },
    notificationType: {
      email: false,
      inApp: false,
    },
    sendImmediate: true,
    scheduleDate: "",
    scheduleTime: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: checked,
      },
    }));
  };

  const handleNotificationTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notificationType: {
        ...prev.notificationType,
        [type]: checked,
      },
    }));
  };

  const handleSendNotification = () => {
    console.log("Sending notification:", formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Send Notification
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create and send notifications to users
        </p>
      </div>

      <div className="grid grid-cols-1  gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              size="lg"
              placeholder="Enter notification title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="min-h-28"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Send To (Roles)</Label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="administrator"
                  checked={formData.roles.administrator}
                  onCheckedChange={(checked) =>
                    handleRoleChange("administrator", checked as boolean)
                  }
                />
                <Label htmlFor="administrator">Administrator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataUploader"
                  checked={formData.roles.dataUploader}
                  onCheckedChange={(checked) =>
                    handleRoleChange("dataUploader", checked as boolean)
                  }
                />
                <Label htmlFor="dataUploader">Data Uploader</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataValidator"
                  checked={formData.roles.dataValidator}
                  onCheckedChange={(checked) =>
                    handleRoleChange("dataValidator", checked as boolean)
                  }
                />
                <Label htmlFor="dataValidator">Data Validator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scientist"
                  checked={formData.roles.scientist}
                  onCheckedChange={(checked) =>
                    handleRoleChange("scientist", checked as boolean)
                  }
                />
                <Label htmlFor="scientist">Scientist</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="researcher"
                  checked={formData.roles.researcher}
                  onCheckedChange={(checked) =>
                    handleRoleChange("researcher", checked as boolean)
                  }
                />
                <Label htmlFor="researcher">Researcher</Label>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-5">
            <Label>Notification Type</Label>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={formData.notificationType.email}
                  onCheckedChange={(checked) =>
                    handleNotificationTypeChange("email", checked as boolean)
                  }
                />
                <Mail className="size-4" />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inApp"
                  checked={formData.notificationType.inApp}
                  onCheckedChange={(checked) =>
                    handleNotificationTypeChange("inApp", checked as boolean)
                  }
                />
                <Bell className="size-4" />
                <Label htmlFor="inApp">In App</Label>
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSendNotification} size={"lg"}>
              <Send className="size-5" />
              Send Notification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
