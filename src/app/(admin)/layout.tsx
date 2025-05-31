'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User,
  LogOut,
  Tag,
  ShoppingCart,
  Percent
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate authentication check
    const timer = setTimeout(() => {
      setIsAuthenticated(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff99] mx-auto mb-4"></div>
          <p className="text-gray-400 mb-4">Checking authentication...</p>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="bg-[#00ff99] text-black px-6 py-2 rounded-xl font-semibold hover:bg-[#00cc7a] transition-colors"
          >
            Login as Admin (Demo)
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'products', label: 'Products', icon: Package, path: '/dashboard/products' },
    { id: 'categories', label: 'Categories/Tag', icon: Tag, path: '/dashboard/categories' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
    { id: 'users', label: 'Users', icon: Users, path: '/dashboard/users' },
    { id: 'promotions', label: 'Promotions', icon: Percent, path: '/dashboard/promotions' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/products') return 'Products';
    if (pathname === '/dashboard/categories') return 'Categories/Tag';
    if (pathname === '/dashboard/orders') return 'Orders';
    if (pathname === '/dashboard/users') return 'Users';
    if (pathname === '/dashboard/promotions') return 'Promotions';
    if (pathname === '/dashboard/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed lg:sticky lg:top-0 z-50 w-72 h-screen bg-[#0f0f0f] border-r border-[#2f2f2f] flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-[#2f2f2f]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#00ff99] rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-sm">P</span>
                  </div>
                  <span className="text-white font-bold text-xl">PIXEL Admin</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#00ff99] text-black font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-[#2f2f2f]">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-[#1a1a1a] transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#0f0f0f] border-b border-[#2f2f2f] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xl font-semibold text-white">
                {getPageTitle()}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
                />
              </div>

              {/* Notifications */}
              <button className="relative text-gray-400 hover:text-white">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff99] rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="w-8 h-8 bg-[#00ff99] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto px-3 lg:px-3 py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;