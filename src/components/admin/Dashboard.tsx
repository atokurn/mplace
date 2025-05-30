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

const Dashboard = () => {
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
      title: 'Total Sales',
      value: '1,234',
      change: -3.1,
      icon: <ShoppingBag size={24} />,
      color: 'text-purple-400'
    },
    {
      title: 'Downloads',
      value: '8,921',
      change: 15.3,
      icon: <Download size={24} />,
      color: 'text-orange-400'
    }
  ];

  const recentSales = [
    {
      id: 1,
      product: 'Abstract Vector Pack',
      customer: 'John Doe',
      amount: '$25.00',
      time: '2 minutes ago'
    },
    {
      id: 2,
      product: 'Minimal Background Set',
      customer: 'Jane Smith',
      amount: '$15.00',
      time: '5 minutes ago'
    },
    {
      id: 3,
      product: 'Logo Design Bundle',
      customer: 'Mike Johnson',
      amount: '$50.00',
      time: '12 minutes ago'
    },
    {
      id: 4,
      product: 'UI Kit Collection',
      customer: 'Sarah Wilson',
      amount: '$35.00',
      time: '18 minutes ago'
    },
    {
      id: 5,
      product: 'Icon Set Pro',
      customer: 'Alex Brown',
      amount: '$20.00',
      time: '25 minutes ago'
    }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Abstract Vector Pack',
      sales: 145,
      revenue: '$3,625',
      trend: 12.5
    },
    {
      id: 2,
      name: 'Logo Design Bundle',
      sales: 98,
      revenue: '$4,900',
      trend: 8.3
    },
    {
      id: 3,
      name: 'UI Kit Collection',
      sales: 87,
      revenue: '$3,045',
      trend: -2.1
    },
    {
      id: 4,
      name: 'Minimal Background Set',
      sales: 76,
      revenue: '$1,140',
      trend: 15.7
    },
    {
      id: 5,
      name: 'Icon Set Pro',
      sales: 65,
      revenue: '$1,300',
      trend: 5.2
    }
  ];

  const categoryData: ChartData[] = [
    { name: 'Vector', value: 35, color: '#00ff99' },
    { name: 'UI Kit', value: 25, color: '#0099ff' },
    { name: 'Logo', value: 20, color: '#ff6b6b' },
    { name: 'Background', value: 15, color: '#ffd93d' },
    { name: 'Icon', value: 5, color: '#6c5ce7' }
  ];

  const salesData = [
    { day: 'Mon', sales: 45 },
    { day: 'Tue', sales: 52 },
    { day: 'Wed', sales: 38 },
    { day: 'Thu', sales: 61 },
    { day: 'Fri', sales: 55 },
    { day: 'Sat', sales: 67 },
    { day: 'Sun', sales: 43 }
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400">Welcome back! Here's what's happening with your marketplace.</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-2 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6 hover:border-[#00ff99] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={stat.color}>
                {stat.icon}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Weekly Sales</h3>
            <BarChart3 className="text-[#00ff99]" size={20} />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.map((data, index) => (
              <div key={data.day} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.sales / maxSales) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-[#00ff99] to-[#00cc77] rounded-t-lg mb-2 min-h-[20px]"
                />
                <span className="text-gray-400 text-sm">{data.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Category Distribution</h3>
            <PieChart className="text-[#00ff99]" size={20} />
          </div>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-white">{category.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-[#2f2f2f] rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.value}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-8">{category.value}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Sales</h3>
            <Activity className="text-[#00ff99]" size={20} />
          </div>
          <div className="space-y-4">
            {recentSales.map((sale, index) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-[#2f2f2f] rounded-xl"
              >
                <div>
                  <p className="text-white font-medium">{sale.product}</p>
                  <p className="text-gray-400 text-sm">{sale.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#00ff99] font-bold">{sale.amount}</p>
                  <p className="text-gray-400 text-sm">{sale.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Top Products</h3>
            <Star className="text-[#00ff99]" size={20} />
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-[#2f2f2f] rounded-xl"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-gray-400 text-sm">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="text-[#00ff99] font-bold">{product.revenue}</p>
                  <div className={`flex items-center space-x-1 text-sm ${
                    product.trend >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {product.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{Math.abs(product.trend)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6"
      >
        <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white p-4 rounded-xl transition-colors flex flex-col items-center space-y-2">
            <ShoppingBag size={24} />
            <span className="text-sm">View Orders</span>
          </button>
          <button className="bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white p-4 rounded-xl transition-colors flex flex-col items-center space-y-2">
            <Users size={24} />
            <span className="text-sm">Manage Users</span>
          </button>
          <button className="bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white p-4 rounded-xl transition-colors flex flex-col items-center space-y-2">
            <Eye size={24} />
            <span className="text-sm">View Reports</span>
          </button>
          <button className="bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white p-4 rounded-xl transition-colors flex flex-col items-center space-y-2">
            <Calendar size={24} />
            <span className="text-sm">Schedule</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;