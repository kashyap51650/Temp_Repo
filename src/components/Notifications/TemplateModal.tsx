import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import type { TemplateRow } from "@/components/organisms/DataTable/tableData";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/Form/Form";

type Mode = "create" | "edit" | "view";

interface TemplateModalProps {
  open: boolean;
  mode: Mode;
  template: TemplateRow | null;
  onOpenChange: (open: boolean) => void;
  onSave: (t: TemplateRow) => void; // save for create/edit
}

export default function TemplateModal({
  open,
  mode,
  template,
  onOpenChange,
  onSave,
}: TemplateModalProps) {
  const [formState, setFormState] = useState<TemplateRow | null>(null);

  useEffect(() => {
    if (mode === "create") {
      setFormState({
        id: `tmp-${Date.now()}`,
        name: "",
        subject: "",
        content: "",
        createdBy: "",
        createdDate: new Date().toISOString().split("T")[0],
        usageCount: 0,
        isActive: true,
      });
    } else {
      setFormState(template ?? null);
    }
  }, [mode, template, open]);

  const schema = z.object({
    name: z.string().min(1, "Template name is required"),
    subject: z.string().min(1, "Subject is required"),
    content: z.string().min(1, "Content is required"),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      subject: "",
      content: "",
    },
  });

  useEffect(() => {
    if (formState) {
      form.reset({
        name: formState.name,
        subject: formState.subject,
        content: formState.content,
      });
    }
  }, [formState, form]);

  if (!formState) return null;

  const title =
    mode === "create"
      ? "Create Template"
      : mode === "edit"
        ? "Edit Template"
        : "View Template";

  type Detail = { label: string; value: string | number };
  const templateDetails: Detail[] = [
    { label: "Template Name :", value: formState.name },
    { label: "Subject :", value: formState.subject },
    { label: "Content :", value: formState.content },
    { label: "Created By :", value: formState.createdBy },
    { label: "Created Date :", value: formState.createdDate },
    { label: "Usage Count :", value: formState.usageCount },
  ];

  const onSubmit = (values: FormValues) => {
    const updated: TemplateRow = {
      id: formState.id,
      name: values.name,
      subject: values.subject,
      content: values.content,
      createdBy: formState.createdBy,
      createdDate: formState.createdDate,
      usageCount: formState.usageCount ?? 0,
      isActive: formState.isActive,
    };
    onSave(updated);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={mode === "view" ? undefined : "Fill template details"}
      trigger={null}
      className="max-w-4xl"
    >
      {mode === "view" ? (
        <div className="space-y-4 py-2 mt-4">
          <div className="grid grid-cols-1 gap-5">
            {templateDetails.map(({ label, value }) => (
              <div className="flex justify-between items-start" key={label}>
                <div className="mb-1 text-sm font-medium text-muted-foreground min-w-36">
                  {label}
                </div>
                <div className="font-normal ml-4 text-sm text-end">{value}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input size="lg" placeholder="Template Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input size="lg" placeholder="Subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter template content..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size={"lg"}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"}>
                {mode === "create" ? "Create" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Dialog>
  );
}
