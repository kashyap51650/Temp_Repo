import React from "react";
import { Outlet } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/organisms";
import { AppSidebar } from "@/components/templates";

import { DashboardHeader } from "./DashboardHeader";

export const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="@container/main min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="flex flex-col gap-6 p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
