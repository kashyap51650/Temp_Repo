import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Mail, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

import { notificationApi, roleApi } from "@/api";
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
import { handleApiError } from "@/lib/api";
import {
  createNotificationSchema,
  type NotificationDataType,
} from "@/schemas/notificationSchema";

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
  const form = useForm<NotificationDataType>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      subject: "",
      message: "",
      selectedRoleIds: [],
      notificationTypes: [],
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const [roles, setRoles] = useState<Role[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
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

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);

    if (templateId && templateId !== "none") {
      const template = templates.find((t) => t.id.toString() === templateId);
      if (template) {
        form.setValue("subject", template.template_subject);
        form.setValue("message", template.template_content);
      }
    } else if (templateId === "none") {
      form.setValue("subject", "");
      form.setValue("message", "");
    }
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    const currentRoles = form.getValues("selectedRoleIds");
    const updatedRoles = checked
      ? [...currentRoles, roleId]
      : currentRoles.filter((id) => id !== roleId);
    form.setValue("selectedRoleIds", updatedRoles, { shouldValidate: true });
  };

  const handleNotificationTypeChange = (type: string, checked: boolean) => {
    const currentTypes = form.getValues("notificationTypes");
    const updatedTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter((t) => t !== type);
    form.setValue("notificationTypes", updatedTypes, { shouldValidate: true });
  };

  const handleSendNotification = async (values: NotificationDataType) => {
    try {
      const payload = {
        subject: values.subject,
        message: values.message,
        notification_types: values.notificationTypes,
        recipient_role_ids: values.selectedRoleIds,
      };

      const response = await notificationApi.createNotification(payload);

      if (response.success) {
        toast.success(response.message || "Notification sent successfully!");
        reset();
        setSelectedTemplate("none");
      }
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to send notification");
      toast.error(errorMessage);
    }
  };

  const handleErrors = (errors: FieldErrors<NotificationDataType>) => {
    const validationErrors = Object.values(errors)
      .map((val) => val?.message)
      .filter(Boolean);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
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
      <form
        onSubmit={handleSubmit(handleSendNotification, handleErrors)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
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

            <Controller
              control={form.control}
              name="subject"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="subject">Notification Subject</Label>
                  <Input
                    id="subject"
                    size="lg"
                    placeholder="Enter notification subject"
                    {...field}
                  />
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="message"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>

                  <Textarea
                    id="message"
                    placeholder="Enter your message here..."
                    className="min-h-28"
                    {...field}
                  />
                </div>
              )}
            />
          </div>

          <div className="space-y-4">
            <Controller
              control={form.control}
              name="selectedRoleIds"
              render={({ field }) => (
                <div className="space-y-3">
                  <Label>Send To (Roles)</Label>
                  {isLoading ? (
                    <div className="text-sm text-muted-foreground">
                      Loading roles...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={field.value.includes(role.id)}
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
              )}
            />

            <Controller
              control={form.control}
              name="notificationTypes"
              render={({ field }) => (
                <div className="space-y-3 mt-5">
                  <Label>Notification Type</Label>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email"
                        checked={field.value.includes("email")}
                        onCheckedChange={(checked) =>
                          handleNotificationTypeChange(
                            "email",
                            checked as boolean
                          )
                        }
                      />
                      <Mail className="size-4" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="app"
                        checked={field.value.includes("app")}
                        onCheckedChange={(checked) =>
                          handleNotificationTypeChange(
                            "app",
                            checked as boolean
                          )
                        }
                      />
                      <Bell className="size-4" />
                      <Label htmlFor="app">In App</Label>
                    </div>
                  </div>
                </div>
              )}
            />

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                size={"lg"}
                disabled={isSubmitting || isLoading}
              >
                <Send className="size-5" />
                {isSubmitting ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
