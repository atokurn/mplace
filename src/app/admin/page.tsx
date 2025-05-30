'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Upload, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import Dashboard from '@/components/admin/Dashboard';
import ProductManager from '@/components/admin/ProductManager';
import UserManager from '@/components/admin/UserManager';
import FileUpload from '@/components/admin/FileUpload';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate authentication check
  useEffect(() => {
    // In a real app, you'd check for valid admin token/session
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(isAdmin);
  }, []);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin privileges to access this page.</p>
          <button
            onClick={() => {
              localStorage.setItem('isAdmin', 'true');
              setIsAuthenticated(true);
            }}
            className="bg-[#00ff99] text-black px-6 py-3 rounded-xl font-medium hover:bg-[#00cc77] transition-colors"
          >
            Login as Admin (Demo)
          </button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'uploads', label: 'File Upload', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
  };





  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManager />;
      case 'users':
        return <UserManager />;
      case 'uploads':
        return <FileUpload />;
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <p className="text-gray-400">Configure your marketplace settings</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6">
                <h3 className="text-lg font-bold text-white mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="PIXEL Digital Marketplace"
                      className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Site Description</label>
                    <textarea
                      defaultValue="Premium digital assets marketplace"
                      className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors h-24 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="admin@pixelmarketplace.com"
                      className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6">
                <h3 className="text-lg font-bold text-white mb-4">Payment Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Commission Rate (%)</label>
                    <input
                      type="number"
                      defaultValue="15"
                      className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Minimum Payout ($)</label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="autoApproval"
                      defaultChecked
                      className="w-4 h-4 text-[#00ff99] bg-[#2f2f2f] border-[#3f3f3f] rounded focus:ring-[#00ff99]"
                    />
                    <label htmlFor="autoApproval" className="text-gray-300">Auto-approve products</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-[#00ff99] text-black px-6 py-3 rounded-xl font-medium hover:bg-[#00cc77] transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#1a1a1a] border-r border-[#2f2f2f] min-h-screen p-6"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-gray-400 text-sm">PIXEL Marketplace</p>
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#00ff99] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-[#2f2f2f]'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-[#2f2f2f] transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;