import { Button } from "@/components/atoms";
import { DataTable } from "@/components/organisms";
import { columns } from "@/components/organisms/DataTable/tableColumns";
import { tableData } from "@/components/organisms/DataTable/tableData";

export default function UserManagementPage() {
  return (
    <div className="px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-black">
            User Management
          </h1>
          <p className="text-gray-600 mb-4">
            Manage users and their access to the platform Add User
          </p>
        </div>
        <Button variant={"default"}>Add User</Button>
      </div>

      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
