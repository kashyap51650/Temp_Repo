"use client";

import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFolder,
  IconHelp,
  IconHome,
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
import { useProfile } from "@/hooks/useProfile";

import { sidebarData } from "./data";

const iconMap = {
  IconHome,
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconHelp,
  IconReport,
  IconSettings,
  IconDatabase,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfile();

  const userData = React.useMemo(() => {
    if (profile) {
      return {
        name:
          profile.full_name ||
          `${profile.first_name} ${profile.last_name}`.trim() ||
          "User",
        email: profile.email || "user@example.com",
        avatar: profile.profile_picture || "/avatars/shadcn.jpg",
      };
    }
    return sidebarData.user;
  }, [profile]);

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
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
