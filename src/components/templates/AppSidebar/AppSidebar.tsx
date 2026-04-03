"use client";

import {
  IconChartBar,
  IconChartLine,
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
import { usePermissions } from "@/hooks/usePermissions";
import { useProfile } from "@/hooks/useProfile";

import { sidebarData } from "./data";

const iconMap = {
  IconHome,
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconChartLine,
  IconFolder,
  IconHelp,
  IconReport,
  IconSettings,
  IconDatabase,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfile();
  const navItems = sidebarData.navMain;

  const { hasAnyPermission, hasAllPermissions } = usePermissions();

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

  const authorizedNavItems = navItems.filter((item) => {
    const hasRequired =
      !item.requiredPermissions || hasAllPermissions(item.requiredPermissions);
    const hasAny = !item.permissions || hasAnyPermission(item.permissions);
    return hasRequired && hasAny;
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="gap-1">
        <div className="text-xl font-semibold px-2">Orano Med</div>
        <p className="text-sm text-slate-500 px-2">Research Data Platform</p>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={authorizedNavItems.map((item) => ({
            title: item.title,
            url: item.url,
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
