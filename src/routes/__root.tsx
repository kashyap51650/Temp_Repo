import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/organisms";
import { AppSidebar } from "@/components/templates";
import { SiteHeader } from "@/components/templates/SiteHeader/site-header";

function RootLayout() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  // If it's an auth route, render without dashboard layout
  if (isAuthRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Outlet />
      </div>
    );
  }

  // For all other routes, render with dashboard layout
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
