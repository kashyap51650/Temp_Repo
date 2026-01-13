import {
  createRootRoute,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { SidebarInset, SidebarProvider } from "@/components/organisms";
import { AppSidebar } from "@/components/templates";
import { SiteHeader } from "@/components/templates/SiteHeader/site-header";
import { useIsAuthenticated } from "@/lib/auth";

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isAuthenticated = useIsAuthenticated();
  const isAuthRoute = location.pathname.startsWith("/auth");
  const isNavigating = routerState.status === "pending";

  useEffect(() => {
    if (isAuthRoute) return;

    if (!isAuthenticated) {
      navigate({
        to: "/auth/login",
        search: { redirect: location.pathname },
      });
    }
  }, [isAuthenticated, isAuthRoute, navigate, location.pathname]);

  // If not authenticated and navigating away, don't render anything
  if (!isAuthenticated && isNavigating) {
    return null;
  }

  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Outlet />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Checking authentication...
          </p>
        </div>
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
