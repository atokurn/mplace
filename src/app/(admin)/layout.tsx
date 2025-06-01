"use client"

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Tag,
  ShoppingCart,
  Percent,
  Search,
  Bell,
  LogOut,
  User
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (session.user.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff99] mx-auto mb-4"></div>
          <p className="text-gray-400 mb-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'products', label: 'Products', icon: Package, path: '/dashboard/products' },
    { id: 'categories', label: 'Categories', icon: Tag, path: '/dashboard/categories' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
    { id: 'users', label: 'Users', icon: Users, path: '/dashboard/users' },
    { id: 'promotions', label: 'Promotions', icon: Percent, path: '/dashboard/promotions' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/products') return 'Products';
    if (pathname === '/dashboard/categories') return 'Categories';
    if (pathname === '/dashboard/orders') return 'Orders';
    if (pathname === '/dashboard/users') return 'Users';
    if (pathname === '/dashboard/promotions') return 'Promotions';
    if (pathname === '/dashboard/analytics') return 'Analytics';
    if (pathname === '/dashboard/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <Sidebar className="border-r border-[#2f2f2f] bg-[#0f0f0f]">
          <SidebarHeader className="border-b border-[#2f2f2f] p-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00ff99] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">P</span>
              </div>
              <span className="text-white font-bold text-xl">PIXEL Admin</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                Main Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          className={`w-full ${isActive
                            ? 'bg-[#00ff99] text-black font-semibold hover:bg-[#00ff99]'
                            : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                          }`}
                        >
                          <Link href={item.path} className="flex items-center gap-3">
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-[#2f2f2f] p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full text-gray-400 hover:text-white hover:bg-[#1a1a1a]">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-[#00ff99] text-black text-xs">A</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Admin User</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-56 bg-[#1a1a1a] border-[#2f2f2f]">
                    <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#2f2f2f]" />
                    <DropdownMenuItem className="text-gray-400 hover:text-white hover:bg-[#2f2f2f]">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-400 hover:text-white hover:bg-[#2f2f2f]">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#2f2f2f]" />
                    <DropdownMenuItem 
                      className="text-red-400 hover:text-red-300 hover:bg-[#2f2f2f]"
                      onClick={() => setIsAuthenticated(false)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-1">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 bg-[#0f0f0f] border-b border-[#2f2f2f] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-400 hover:text-white" />
                <h2 className="text-xl font-semibold text-white">
                  {getPageTitle()}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="bg-[#1a1a1a] border-[#2f2f2f] text-white placeholder-gray-400 pl-10 focus:border-[#00ff99]"
                  />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff99] rounded-full"></span>
                </Button>

                {/* Profile */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-[#00ff99] text-black">A</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;