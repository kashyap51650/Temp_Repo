"use client";

import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSettings,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain, NavUser } from "@/components/molecules";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/organisms";

import { sidebarData } from "./data";

const iconMap = {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconHelp,
  IconReport,
  IconSettings,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="gap-1">
        <div className="text-xl font-semibold px-2">Orano Med</div>
        <p className="text-sm text-slate-500 px-2">Research Data Platform</p>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={sidebarData.navMain.map((item) => ({
            ...item,
            icon: iconMap[item.icon as keyof typeof iconMap],
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
