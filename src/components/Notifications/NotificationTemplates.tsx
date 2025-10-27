import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/atoms";
import { DataTable } from "@/components/organisms";
import { getTemplateColumns } from "@/components/organisms/DataTable/tableColumns";
import {
  templateData as initialTemplates,
  type TemplateRow,
} from "@/components/organisms/DataTable/tableData";

import TemplateModal from "./TemplateModal";

export function NotificationTemplates() {
  const [templates, setTemplates] = useState<TemplateRow[]>(initialTemplates);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selected, setSelected] = useState<TemplateRow | null>(null);

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

  const handleSave = (t: TemplateRow) => {
    if (modalMode === "create") {
      setTemplates((prev) => [t, ...prev]);
    } else {
      setTemplates((prev) => prev.map((p) => (p.id === t.id ? t : p)));
    }
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

      <DataTable
        columns={getTemplateColumns(handleEditTemplate, handleViewTemplate)}
        data={templates}
      />
    </div>
  );
}
