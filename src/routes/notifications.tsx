import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notifications")({
  component: NotificationsComponent,
});

function NotificationsComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications Page</h1>
      <p>View and manage notifications here.</p>
    </div>
  );
}
