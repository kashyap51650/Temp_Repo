import { Bell, Mail, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/atoms";
import { handleApiError, notificationApi, roleApi } from "@/lib/api";

interface Role {
  id: number;
  name: string;
}

interface NotificationTemplate {
  id: number;
  template_name: string;
  template_subject: string;
  template_content: string;
}

export function CreateNotification() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    selectedRoleIds: [] as number[],
    notificationTypes: [] as string[],
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetchedRoles = useRef(false);
  const hasFetchedTemplates = useRef(false);

  useEffect(() => {
    if (hasFetchedRoles.current) return;

    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        hasFetchedRoles.current = true;
        const response = await roleApi.getRolesDropdown();
        if (response.success && response.data) {
          setRoles(response.data);
        }
      } catch (error) {
        const errorMessage = handleApiError(error, "Failed to fetch roles");
        toast.error(errorMessage);
        hasFetchedRoles.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (hasFetchedTemplates.current) return;

    const fetchTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        hasFetchedTemplates.current = true;
        const response =
          await notificationApi.getNotificationTemplatesDropdown();
        if (response.success && response.data) {
          setTemplates(response.data);
        }
      } catch (error) {
        const errorMessage = handleApiError(
          error,
          "Failed to fetch notification templates"
        );
        toast.error(errorMessage);
        hasFetchedTemplates.current = false;
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);

    if (templateId && templateId !== "none") {
      const template = templates.find((t) => t.id.toString() === templateId);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          subject: template.template_subject,
          message: template.template_content,
        }));
      }
    } else if (templateId === "none") {
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    }
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoleIds: checked
        ? [...prev.selectedRoleIds, roleId]
        : prev.selectedRoleIds.filter((id) => id !== roleId),
    }));
  };

  const handleNotificationTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notificationTypes: checked
        ? [...prev.notificationTypes, type]
        : prev.notificationTypes.filter((t) => t !== type),
    }));
  };

  const validateForm = () => {
    if (!formData.subject.trim()) {
      toast.error("Please enter a notification subject");
      return false;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter a notification message");
      return false;
    }
    if (formData.selectedRoleIds.length === 0) {
      toast.error("Please select at least one role");
      return false;
    }
    if (formData.notificationTypes.length === 0) {
      toast.error("Please select at least one notification type");
      return false;
    }
    return true;
  };

  const handleSendNotification = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        subject: formData.subject,
        message: formData.message,
        notification_types: formData.notificationTypes,
        recipient_role_ids: formData.selectedRoleIds,
      };

      const response = await notificationApi.createNotification(payload);

      if (response.success) {
        toast.success(response.message || "Notification sent successfully!");
        setFormData({
          subject: "",
          message: "",
          selectedRoleIds: [],
          notificationTypes: [],
        });
        setSelectedTemplate("none");
      }
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to send notification");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
            <Label htmlFor="template">Notification Template (Optional)</Label>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template to auto-fill subject and message" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTemplates ? (
                  <SelectItem value="loading" disabled>
                    Loading templates...
                  </SelectItem>
                ) : (
                  <>
                    <SelectItem value="none">None - Manual entry</SelectItem>
                    {templates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id.toString()}
                      >
                        {template.template_subject}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Notification Subject</Label>
            <Input
              id="subject"
              size="lg"
              placeholder="Enter notification subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
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
            {isLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading roles...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={formData.selectedRoleIds.includes(role.id)}
                      onCheckedChange={(checked) =>
                        handleRoleChange(role.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 mt-5">
            <Label>Notification Type</Label>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={formData.notificationTypes.includes("email")}
                  onCheckedChange={(checked) =>
                    handleNotificationTypeChange("email", checked as boolean)
                  }
                />
                <Mail className="size-4" />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="app"
                  checked={formData.notificationTypes.includes("app")}
                  onCheckedChange={(checked) =>
                    handleNotificationTypeChange("app", checked as boolean)
                  }
                />
                <Bell className="size-4" />
                <Label htmlFor="app">In App</Label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSendNotification}
              size={"lg"}
              disabled={isSubmitting || isLoading}
            >
              <Send className="size-5" />
              {isSubmitting ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
