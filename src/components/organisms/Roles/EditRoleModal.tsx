import type { ReactElement } from "react";

import { RoleFormModal } from "./RoleFormModal";

export interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: { id: string; name: string; description: string } | null;
  onSave: (roleData: { id: string; name: string; description: string }) => void;
}

export function EditRoleModal({
  open,
  onOpenChange,
  role,
  onSave,
}: EditRoleModalProps): ReactElement {
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
