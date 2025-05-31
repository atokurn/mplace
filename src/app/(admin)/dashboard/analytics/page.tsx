'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  Eye,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  users: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  views: {
    current: number;
    previous: number;
    change: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    image: string;
  }>;
  revenueChart: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
  }>;
  categoryStats: Array<{
    category: string;
    percentage: number;
    revenue: number;
    color: string;
  }>;
}

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockData: AnalyticsData = {
      revenue: {
        current: 45230,
        previous: 38950,
        change: 16.1
      },
      users: {
        current: 1250,
        previous: 1180,
        change: 5.9
      },
      orders: {
        current: 892,
        previous: 756,
        change: 18.0
      },
      views: {
        current: 12450,
        previous: 11200,
        change: 11.2
      },
      topProducts: [
        {
          id: '1',
          name: 'Premium UI Kit',
          sales: 156,
          revenue: 7800,
          image: '/api/placeholder/60/60'
        },
        {
          id: '2',
          name: '3D Icons Pack',
          sales: 134,
          revenue: 6700,
          image: '/api/placeholder/60/60'
        },
        {
          id: '3',
          name: 'Website Template',
          sales: 98,
          revenue: 4900,
          image: '/api/placeholder/60/60'
        },
        {
          id: '4',
          name: 'Logo Collection',
          sales: 87,
          revenue: 4350,
          image: '/api/placeholder/60/60'
        },
        {
          id: '5',
          name: 'Stock Photos',
          sales: 76,
          revenue: 3800,
          image: '/api/placeholder/60/60'
        }
      ],
      revenueChart: [
        { month: 'Jan', revenue: 32000, orders: 450 },
        { month: 'Feb', revenue: 35000, orders: 520 },
        { month: 'Mar', revenue: 38000, orders: 580 },
        { month: 'Apr', revenue: 42000, orders: 650 },
        { month: 'May', revenue: 39000, orders: 600 },
        { month: 'Jun', revenue: 45000, orders: 720 },
        { month: 'Jul', revenue: 48000, orders: 780 },
        { month: 'Aug', revenue: 52000, orders: 850 },
        { month: 'Sep', revenue: 49000, orders: 800 },
        { month: 'Oct', revenue: 55000, orders: 920 },
        { month: 'Nov', revenue: 58000, orders: 980 },
        { month: 'Dec', revenue: 62000, orders: 1050 }
      ],
      userGrowth: [
        { month: 'Jan', users: 850 },
        { month: 'Feb', users: 920 },
        { month: 'Mar', users: 980 },
        { month: 'Apr', users: 1050 },
        { month: 'May', users: 1120 },
        { month: 'Jun', users: 1180 },
        { month: 'Jul', users: 1250 }
      ],
      categoryStats: [
        { category: 'UI/UX Design', percentage: 35, revenue: 15800, color: '#00ff99' },
        { category: 'Graphics', percentage: 28, revenue: 12650, color: '#0099ff' },
        { category: 'Templates', percentage: 20, revenue: 9040, color: '#ff6b35' },
        { category: 'Icons', percentage: 12, revenue: 5420, color: '#ffd23f' },
        { category: 'Others', percentage: 5, revenue: 2260, color: '#ff3366' }
      ]
    };
    
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff99] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-gray-400">Track your marketplace performance</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#00ff99] text-black rounded-xl font-medium hover:bg-[#00cc77] transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="text-green-400" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                data.revenue.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.revenue.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(data.revenue.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatCurrency(data.revenue.current)}
            </h3>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </motion.div>

          {/* Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="text-blue-400" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                data.users.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.users.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(data.users.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(data.users.current)}
            </h3>
            <p className="text-gray-400 text-sm">Total Users</p>
          </motion.div>

          {/* Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-orange-400" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                data.orders.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.orders.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(data.orders.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(data.orders.current)}
            </h3>
            <p className="text-gray-400 text-sm">Total Orders</p>
          </motion.div>

          {/* Views */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Eye className="text-purple-400" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                data.views.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.views.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(data.views.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(data.views.current)}
            </h3>
            <p className="text-gray-400 text-sm">Page Views</p>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Revenue Trend</h3>
              <BarChart3 className="text-gray-400" size={20} />
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {data.revenueChart.slice(-6).map((item, index) => {
                const maxRevenue = Math.max(...data.revenueChart.map(d => d.revenue));
                const height = (item.revenue / maxRevenue) * 100;
                
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center mb-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-[#00ff99] to-[#00cc77] rounded-t-lg min-h-[20px]"
                      />
                    </div>
                    <span className="text-xs text-gray-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Category Distribution</h3>
              <PieChart className="text-gray-400" size={20} />
            </div>
            
            <div className="space-y-4">
              {data.categoryStats.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-white text-sm">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{category.percentage}%</p>
                    <p className="text-gray-400 text-xs">{formatCurrency(category.revenue)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Selling Products</h3>
            <Activity className="text-gray-400" size={20} />
          </div>
          
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#2a2a2a] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2a2a2a] rounded-xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{product.name}</h4>
                    <p className="text-gray-400 text-sm">{product.sales} sales</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-semibold">{formatCurrency(product.revenue)}</p>
                  <p className="text-gray-400 text-sm">Revenue</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;