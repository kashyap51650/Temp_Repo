import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";
import { CalendarDatePicker } from "@/components/organisms/CalendarDatePicker/CalendarDatePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/Form/Form";
import { useRoles } from "@/hooks/useFetch";
import type { Role } from "@/types/auth";

export interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    roleId?: string;
    expiry?: string | null;
  };
  onSave: (data: {
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    expiry: string | null;
  }) => void;
  isLoading?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  open,
  onOpenChange,
  mode,
  user,
  onSave,
  isLoading = false,
}) => {
  const { data: rolesData, isLoading: rolesLoading } = useRoles();

  const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    roleId: z.string().min(1, "Role is required"),
    expiry: z.date().nullable().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const getDefaultValues = React.useCallback(() => {
    if (mode === "edit" && user) {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId || "",
        expiry: user.expiry ? new Date(user.expiry) : null,
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
      expiry: null,
    };
  }, [mode, user]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
  });

  React.useEffect(() => {
    form.reset(getDefaultValues());
  }, [form, getDefaultValues]);

  const handleSave = (values: FormValues) => {
    onSave({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleId: values.roleId,
      expiry: values.expiry ? values.expiry.toISOString() : null,
    });

    if (mode === "add") {
      form.reset();
    }
    onOpenChange(false);
  };

  const roles = React.useMemo(() => {
    return rolesData?.data?.items || [];
  }, [rolesData]);

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit User" : "Add New User";
  const description = isEdit
    ? "Update user account details."
    : "Create a new user account for the platform";

  const getSubmitText = () => {
    if (isEdit) {
      return isLoading ? "Updating..." : "Update";
    }
    return isLoading ? "Creating..." : "Save";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      trigger={null}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <div className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      size="lg"
                      placeholder="Enter first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input size="lg" placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      size="lg"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={rolesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            rolesLoading ? "Loading roles..." : "Select a role"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role: Role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Expiry Date</FormLabel>
                  <FormControl>
                    <CalendarDatePicker
                      id="expiry"
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      placeholder="Select expiry date (future dates only)"
                      disablePastDates
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-2 justify-end pt-3">
            <Button
              variant="outline"
              size={"lg"}
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              size={"lg"}
              className="default"
              type="submit"
              disabled={isLoading}
            >
              {getSubmitText()}
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
