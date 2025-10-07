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

import {
  // NavDocuments,
  NavMain,
  // NavSecondary,
  NavUser,
} from "@/components/molecules";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/organisms";

const data = {
  user: {
    name: "Admin user",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "User Management",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "RBAC",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Data Upload",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Data Validate",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Templates",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Notifications",
      url: "#",
      icon: IconReport,
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <button
                type="button"
                className="text-2xl font-semibold bg-transparent border-none p-0 m-0 cursor-pointer"
              >
                Orano Med
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
