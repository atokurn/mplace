'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Package,
  User,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  orderDate: string;
  paymentMethod: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        products: [
          { id: '1', name: 'Vector Pack - Nature', price: 25.00, quantity: 1 },
          { id: '2', name: 'Background Set - Abstract', price: 15.00, quantity: 2 }
        ],
        totalAmount: 55.00,
        status: 'completed',
        orderDate: '2024-01-15T10:30:00Z',
        paymentMethod: 'Credit Card'
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        products: [
          { id: '3', name: 'Icon Set - Business', price: 35.00, quantity: 1 }
        ],
        totalAmount: 35.00,
        status: 'pending',
        orderDate: '2024-01-14T15:45:00Z',
        paymentMethod: 'PayPal'
      },
      {
        id: 'ORD-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        products: [
          { id: '4', name: 'Template Bundle - Web', price: 50.00, quantity: 1 }
        ],
        totalAmount: 50.00,
        status: 'refunded',
        orderDate: '2024-01-13T09:20:00Z',
        paymentMethod: 'Credit Card'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'refunded': return 'text-blue-400 bg-blue-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'refunded': return <RefreshCw size={16} />;
      case 'failed': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderStats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff99]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-gray-400">Manage customer orders and track sales</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2f2f2f] text-white px-4 py-2 rounded-xl hover:bg-[#2a2a2a] transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Package className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-white text-xl font-bold">{orderStats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-white text-xl font-bold">{orderStats.completed}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Clock className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-white text-xl font-bold">{orderStats.pending}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#00ff99]/10 rounded-xl flex items-center justify-center">
              <DollarSign className="text-[#00ff99]" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-white text-xl font-bold">${orderStats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f0f0f] border-b border-[#2f2f2f]">
              <tr>
                <th className="text-left p-4 text-gray-400 font-medium">Order ID</th>
                <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
                <th className="text-left p-4 text-gray-400 font-medium">Products</th>
                <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-[#2f2f2f] hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="p-4">
                    <span className="text-white font-medium">{order.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{order.customerName}</p>
                      <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-white">{product.name}</span>
                          <span className="text-gray-400 ml-2">x{product.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white font-medium">${order.totalAmount.toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm">{formatDate(order.orderDate)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-white p-1 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-white p-1 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No orders found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;