import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms";
import { DataTable } from "@/components/organisms";
import { getTemplateColumns } from "@/components/organisms/DataTable/tableColumns";
import { type TemplateRow } from "@/components/organisms/DataTable/tableData";
import { handleApiError, notificationApi } from "@/lib/api";

import TemplateModal from "./TemplateModal";

interface NotificationTemplate {
  id: number;
  template_name: string;
  template_subject: string;
  template_content: string;
  is_active: boolean;
  created_at: string;
  creator: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function NotificationTemplates() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selected, setSelected] = useState<TemplateRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const hasFetchedTemplates = useRef(false);

  const transformTemplate = (template: NotificationTemplate): TemplateRow => {
    const createdDate = new Date(template.created_at).toLocaleDateString();
    const createdBy = `${template.creator.first_name} ${template.creator.last_name}`;

    return {
      id: template.id.toString(),
      name: template.template_name,
      subject: template.template_subject,
      content: template.template_content,
      createdBy,
      createdDate,
      usageCount: 0,
      isActive: template.is_active,
    };
  };

  const fetchTemplates = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotificationTemplates(page, 10);

      if (response.success && response.data) {
        const transformedTemplates = response.data.items.map(transformTemplate);
        setTemplates(transformedTemplates);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to fetch notification templates"
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedTemplates.current) return;
    hasFetchedTemplates.current = true;
    fetchTemplates();
  }, []);

  const handleEditTemplate = (template: TemplateRow) => {
    setSelected(template);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleViewTemplate = (template: TemplateRow) => {
    setSelected(template);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleCreateTemplate = () => {
    setSelected(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleSave = async (t: TemplateRow) => {
    try {
      if (modalMode === "edit") {
        await notificationApi.updateNotificationTemplate(t.id, {
          template_name: t.name,
          template_subject: t.subject,
          template_content: t.content,
        });
        toast.success("Template updated successfully!");
      } else if (modalMode === "create") {
        await notificationApi.createNotificationTemplate({
          template_name: t.name,
          template_subject: t.subject,
          template_content: t.content,
        });
        toast.success("Template created successfully!");
      }

      fetchTemplates(currentPage);
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        `Failed to ${modalMode} template`
      );
      toast.error(errorMessage);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTemplates(page);
  };

  return (
    <div className="space-y-6">
      <TemplateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        template={selected}
        onSave={handleSave}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Notification Templates
          </h2>
          <p className="text-muted-foreground">
            Manage reusable notification templates
          </p>
        </div>
        <Button onClick={handleCreateTemplate} size={"lg"}>
          <Plus className="w-4 h-4 " />
          Create Template
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading notification templates...
        </div>
      ) : (
        <>
          <DataTable
            columns={getTemplateColumns(handleEditTemplate, handleViewTemplate)}
            data={templates}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing {templates.length} of {totalItems} templates
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
