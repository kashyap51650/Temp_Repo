import type { ReactElement } from "react";

import { RoleFormModal } from "./RoleFormModal";

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (roleData: { name: string; description: string }) => void;
}

export function CreateRoleModal({
  open,
  onOpenChange,
  onCreate,
}: Readonly<CreateRoleModalProps>): ReactElement {
  return (
    <RoleFormModal
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      onSubmit={onCreate}
    />
  );
}
