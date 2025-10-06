"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Command,
  LifeBuoy,
  Send,
  BadgePercent,
  Banknote,
} from "lucide-react"

import { NavMain } from "@/app/_components/shared/navigation/nav-main"
import { NavProjects } from "@/app/_components/shared/navigation/nav-projects"
import { NavSecondary } from "@/app/_components/shared/navigation/nav-secondary"
// Removed NavUser import
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter, // removed
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@flatmarket.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Manage orders", url: "/orders" },
        { title: "Manage returns", url: "/orders/returns" },
        { title: "Shipping settings", url: "/orders/shipping-settings" },
        { title: "Fulfillment settings", url: "/orders/fulfillment-settings" },
      ],
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
      items: [
        { title: "Manage products", url: "/products" },
        { title: "Manage categories", url: "/categories" },
      ],
    },
    {
      title: "Promotions",
      url: "/promotions",
      icon: BadgePercent,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Finance",
      url: "/finance",
      icon: Banknote,
      items: [
        { title: "Transactions", url: "/finance/transactions" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="h-screen"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">FlatMarket</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* Footer removed */}
    </Sidebar>
  )
}
