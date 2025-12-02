import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/organisms";
import { getNotificationColumns } from "@/components/organisms/DataTable/tableColumns";
import type { NotificationRow } from "@/components/organisms/DataTable/tableData";
import { handleApiError, notificationApi, roleApi } from "@/lib/api";

import { NotificationTableFilters } from "./NotificationTableFilters";
import NotificationViewModal from "./NotificationViewModal";

// API response notification type
interface ApiNotification {
  id: number;
  title: string;
  sent_to: string[];
  sent_by: string;
  date: string;
  type: string[];
  recipients: number;
  status: string;
}

interface Role {
  id: number;
  name: string;
}

export function NotificationHistory() {
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sentToFilter, setSentToFilter] = useState("all");
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const hasFetchedNotifications = useRef(false);
  const hasFetchedRoles = useRef(false);

  // Transform API notification to table row format
  const transformNotification = (
    notification: ApiNotification
  ): NotificationRow => {
    const formattedDate = new Date(notification.date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return {
      id: notification.id.toString(),
      title: notification.title,
      sentTo: notification.sent_to,
      sentBy: notification.sent_by,
      date: formattedDate,
      type: notification.type.map(
        (t) => t.charAt(0).toUpperCase() + t.slice(1)
      ), // Capitalize first letter
      recipients: notification.recipients,
      status:
        notification.status === "sent" ? "Delivered" : notification.status,
    };
  };

  // Fetch notifications from API
  const fetchNotifications = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotifications(page, 10, search);

      if (response.success && response.data) {
        const transformedNotifications = response.data.items.map(
          transformNotification
        );
        setNotifications(transformedNotifications);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to fetch notifications"
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await roleApi.getRolesDropdown();
      if (response.success && response.data) {
        setRoles(response.data);
      }
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to fetch roles");
      toast.error(errorMessage);
    }
  };

  // Initial load
  useEffect(() => {
    if (hasFetchedNotifications.current) return;
    hasFetchedNotifications.current = true;
    fetchNotifications();
  }, []);

  // Fetch roles on component mount
  useEffect(() => {
    if (hasFetchedRoles.current) return;
    hasFetchedRoles.current = true;
    fetchRoles();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedSearch = titleFilter.trim();
      if (searchTerm !== trimmedSearch) {
        setCurrentPage(1);
        fetchNotifications(1, trimmedSearch || undefined);
      }
      setSearchTerm(trimmedSearch);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [titleFilter]);

  const handleClearFilters = () => {
    setTitleFilter("");
    setStatusFilter("all");
    setSentToFilter("all");
    setCurrentPage(1);
    fetchNotifications(1);
  };

  // Client-side filtering for status and sentTo (since API only supports search)
  const filteredData = notifications.filter((item) => {
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "Delivered" && item.status === "Delivered") ||
      (statusFilter === "Failed" && item.status === "Failed") ||
      (statusFilter === "Pending" && item.status === "Pending");

    const sentToMatch =
      sentToFilter === "all" ||
      item.sentTo.some((role) =>
        role.toLowerCase().includes(sentToFilter.toLowerCase())
      );

    return statusMatch && sentToMatch;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNotifications(page, titleFilter.trim() || undefined);
  };

  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<null | NotificationRow>(null);

  const handleView = (row: NotificationRow) => {
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
        roles={roles}
      />

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading notifications...
        </div>
      ) : (
        <>
          <DataTable
            columns={getNotificationColumns(handleView)}
            data={filteredData}
          />

          {/* Simple pagination display */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {totalItems} notifications
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <NotificationViewModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        notification={selected}
      />
    </div>
  );
}
