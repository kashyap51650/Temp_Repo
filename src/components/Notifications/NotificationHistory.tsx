import { useState } from "react";

import { DataTable } from "@/components/organisms";
import { getNotificationColumns } from "@/components/organisms/DataTable/tableColumns";
import { notificationData } from "@/components/organisms/DataTable/tableData";

import { NotificationTableFilters } from "./NotificationTableFilters";
import NotificationViewModal from "./NotificationViewModal";

export function NotificationHistory() {
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sentToFilter, setSentToFilter] = useState("all");

  const handleClearFilters = () => {
    setTitleFilter("");
    setStatusFilter("all");
    setSentToFilter("all");
  };

  const filteredData = notificationData.filter((item) => {
    const titleMatch =
      !titleFilter ||
      item.title.toLowerCase().includes(titleFilter.toLowerCase());
    const statusMatch =
      !statusFilter || statusFilter === "all" || item.status === statusFilter;
    const sentToMatch =
      !sentToFilter ||
      sentToFilter === "all" ||
      item.sentTo.includes(sentToFilter);

    return titleMatch && statusMatch && sentToMatch;
  });

  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<null | (typeof notificationData)[0]>(
    null
  );

  const handleView = (row: (typeof notificationData)[0]) => {
    setSelected(row);
    setViewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Notification History
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          View all sent notifications
        </p>
      </div>

      <NotificationTableFilters
        onTitleFilter={setTitleFilter}
        onStatusFilter={setStatusFilter}
        onSentToFilter={setSentToFilter}
        titleFilter={titleFilter}
        statusFilter={statusFilter}
        sentToFilter={sentToFilter}
        onClearFilters={handleClearFilters}
      />
      <DataTable
        columns={getNotificationColumns(handleView)}
        data={filteredData}
      />

      <NotificationViewModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        notification={selected}
      />
    </div>
  );
}
