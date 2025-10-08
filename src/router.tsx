import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import { SidebarInset, SidebarProvider } from "@/components/organisms";
import { AppSidebar } from "@/components/templates";
import { SiteHeader } from "@/components/templates/SiteHeader/site-header";
import { ThemeProvider } from "@/components/theme-provider";

const UserManagementPage = React.lazy(
  () => import("@/pages/user-management/page")
);
// Add other lazy imports as needed, e.g. LoginPage, ForgotPasswordPage, etc.

export const ROUTES = {
  HOME: "/",
  USER_MANAGEMENT: "/user-management",
  AUTH: {
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
} as const;

function MainLayout() {
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

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
}

export default function AppRouter() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<div>Login Page</div>} />
            <Route
              path="forgot-password"
              element={<div>Forgot Password Page</div>}
            />
            <Route
              path="reset-password"
              element={<div>Reset Password Page</div>}
            />
            <Route path="verify-email" element={<div>Verify Email Page</div>} />
          </Route>

          <Route path={ROUTES.HOME} element={<MainLayout />}>
            <Route
              index
              element={<Navigate to={ROUTES.USER_MANAGEMENT} replace />}
            />
            <Route
              path={ROUTES.USER_MANAGEMENT.slice(1)}
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <UserManagementPage />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
