'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Download,
  Eye,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: 12.5,
      icon: <DollarSign size={24} />,
      color: 'text-green-400'
    },
    {
      title: 'Total Users',
      value: '2,847',
      change: 8.2,
      icon: <Users size={24} />,
      color: 'text-blue-400'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: -2.1,
      icon: <ShoppingBag size={24} />,
      color: 'text-purple-400'
    },
    {
      title: 'Downloads',
      value: '8,945',
      change: 15.3,
      icon: <Download size={24} />,
      color: 'text-orange-400'
    }
  ];

  const revenueData: ChartData[] = [
    { name: 'Jan', value: 4000, color: '#00ff99' },
    { name: 'Feb', value: 3000, color: '#00ff99' },
    { name: 'Mar', value: 5000, color: '#00ff99' },
    { name: 'Apr', value: 4500, color: '#00ff99' },
    { name: 'May', value: 6000, color: '#00ff99' },
    { name: 'Jun', value: 5500, color: '#00ff99' },
  ];

  const categoryData: ChartData[] = [
    { name: 'Graphics', value: 35, color: '#00ff99' },
    { name: 'Templates', value: 25, color: '#0099cc' },
    { name: 'Icons', value: 20, color: '#ff6b6b' },
    { name: 'Fonts', value: 15, color: '#ffd93d' },
    { name: 'Others', value: 5, color: '#6c5ce7' },
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Vibrant Background Pack',
      sales: 245,
      revenue: '$2,450',
      rating: 4.8,
      thumbnail: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: 'Modern UI Kit',
      sales: 189,
      revenue: '$1,890',
      rating: 4.9,
      thumbnail: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: '3D Icon Collection',
      sales: 156,
      revenue: '$1,560',
      rating: 4.7,
      thumbnail: '/api/placeholder/60/60'
    },
    {
      id: 4,
      name: 'Typography Bundle',
      sales: 134,
      revenue: '$1,340',
      rating: 4.6,
      thumbnail: '/api/placeholder/60/60'
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'sale',
      message: 'New purchase: Vibrant Background Pack',
      time: '2 minutes ago',
      icon: <ShoppingBag size={16} className="text-green-400" />
    },
    {
      id: 2,
      type: 'user',
      message: 'New user registration: john@example.com',
      time: '5 minutes ago',
      icon: <Users size={16} className="text-blue-400" />
    },
    {
      id: 3,
      type: 'download',
      message: 'Product downloaded: Modern UI Kit',
      time: '8 minutes ago',
      icon: <Download size={16} className="text-purple-400" />
    },
    {
      id: 4,
      type: 'review',
      message: 'New 5-star review on 3D Icon Collection',
      time: '12 minutes ago',
      icon: <Star size={16} className="text-yellow-400" />
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f] hover:border-[#00ff99]/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-[#0f0f0f] ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueData.map((item, index) => (
              <div key={item.name} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / 6000) * 100}%` }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="w-full bg-[#00ff99] rounded-t-lg mb-2 min-h-[20px]"
                />
                <span className="text-xs text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Category Distribution</h3>
            <PieChart size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top Products</h3>
            <Star size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#0f0f0f] transition-colors"
              >
                <div className="w-12 h-12 bg-[#2f2f2f] rounded-lg flex items-center justify-center">
                  <Eye size={20} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{product.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-400">{product.sales} sales</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-400">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{product.revenue}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Activity size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#0f0f0f] transition-colors"
              >
                <div className="p-2 rounded-lg bg-[#0f0f0f] mt-1">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">{activity.message}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;