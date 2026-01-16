import type { ReactElement } from "react";

import type { RoleDataType } from "@/types/auth";

import { RoleFormModal } from "./RoleFormModal";

interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: { id: string; name: string; description: string } | null;
  onSave: (roleData: RoleDataType) => void;
}

export function EditRoleModal({
  open,
  onOpenChange,
  role,
  onSave,
}: Readonly<EditRoleModalProps>): ReactElement {
  return (
    <RoleFormModal
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      role={role}
      onSubmit={onSave}
    />
  );
}
