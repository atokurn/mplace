"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  const isUrlActive = (url: string) => {
    if (!url) return false
    if (pathname === url) return true
    // Consider active when on a deeper route of the section but avoid partial prefix matches like /products vs /products-2
    return pathname.startsWith(url + "/")
  }

  const isParentActive = (item: { url: string }) => isUrlActive(item.url)

  const isAnySubActive = (item?: { items?: { url: string }[] }) => {
    return Boolean(item?.items?.some((sub) => isUrlActive(sub.url)))
  }

  const isItemOpen = (item: { url: string; isActive?: boolean; items?: { url: string }[] }) => {
    return isParentActive(item) || isAnySubActive(item)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={isItemOpen(item)}>
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  {/* Entire button row toggles submenu (no navigation) */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={isParentActive(item) || isAnySubActive(item)} className="cursor-pointer">
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {/* Chevron also toggles and rotates when open */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                </>
              ) : (
                // Parent without submenu: behave as a normal link
                <SidebarMenuButton asChild tooltip={item.title} isActive={isParentActive(item)}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
              {item.items?.length ? (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isUrlActive(subItem.url)}>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
