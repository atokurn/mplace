'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Package,
  Users,
  Eye,
  MoreHorizontal,
  Tag,
  Gift
} from 'lucide-react';
import Link from 'next/link';

interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bundle';
  value: number;
  code?: string;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  applicableProducts?: string[];
  minimumAmount?: number;
}

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockPromotions: Promotion[] = [
      {
        id: 'PROMO-001',
        name: 'New Year Sale',
        type: 'percentage',
        value: 25,
        code: 'NEWYEAR25',
        description: '25% off on all digital assets',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        usageLimit: 100,
        usageCount: 45,
        isActive: true,
        minimumAmount: 20
      },
      {
        id: 'PROMO-002',
        name: 'First Time Buyer',
        type: 'fixed',
        value: 10,
        code: 'WELCOME10',
        description: '$10 off for new customers',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        usageLimit: 500,
        usageCount: 123,
        isActive: true,
        minimumAmount: 30
      },
      {
        id: 'PROMO-003',
        name: 'Vector Bundle Deal',
        type: 'bundle',
        value: 40,
        description: 'Buy 3 vector packs, get 40% off',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-02-15T23:59:59Z',
        usageCount: 12,
        isActive: true,
        applicableProducts: ['vector-pack-1', 'vector-pack-2', 'vector-pack-3']
      },
      {
        id: 'PROMO-004',
        name: 'Summer Sale 2023',
        type: 'percentage',
        value: 30,
        code: 'SUMMER30',
        description: '30% off summer collection',
        startDate: '2023-06-01T00:00:00Z',
        endDate: '2023-08-31T23:59:59Z',
        usageLimit: 200,
        usageCount: 200,
        isActive: false
      }
    ];

    setTimeout(() => {
      setPromotions(mockPromotions);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'text-blue-400 bg-blue-400/10';
      case 'fixed': return 'text-green-400 bg-green-400/10';
      case 'bundle': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent size={16} />;
      case 'fixed': return <DollarSign size={16} />;
      case 'bundle': return <Package size={16} />;
      default: return <Tag size={16} />;
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isUsageLimitReached = (promotion: Promotion) => {
    return promotion.usageLimit && promotion.usageCount >= promotion.usageLimit;
  };

  const getStatusColor = (promotion: Promotion) => {
    if (!promotion.isActive) return 'text-gray-400 bg-gray-400/10';
    if (isExpired(promotion.endDate)) return 'text-red-400 bg-red-400/10';
    if (isUsageLimitReached(promotion)) return 'text-orange-400 bg-orange-400/10';
    return 'text-green-400 bg-green-400/10';
  };

  const getStatusText = (promotion: Promotion) => {
    if (!promotion.isActive) return 'Inactive';
    if (isExpired(promotion.endDate)) return 'Expired';
    if (isUsageLimitReached(promotion)) return 'Limit Reached';
    return 'Active';
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || promotion.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && promotion.isActive && !isExpired(promotion.endDate) && !isUsageLimitReached(promotion)) ||
                         (statusFilter === 'inactive' && (!promotion.isActive || isExpired(promotion.endDate) || isUsageLimitReached(promotion)));
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatValue = (promotion: Promotion) => {
    if (promotion.type === 'percentage') return `${promotion.value}%`;
    if (promotion.type === 'fixed') return `$${promotion.value}`;
    if (promotion.type === 'bundle') return `${promotion.value}% off`;
    return promotion.value.toString();
  };

  const promotionStats = {
    total: promotions.length,
    active: promotions.filter(p => p.isActive && !isExpired(p.endDate) && !isUsageLimitReached(p)).length,
    expired: promotions.filter(p => isExpired(p.endDate)).length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0)
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
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
          <h1 className="text-2xl font-bold text-white mb-2">Promotions Management</h1>
          <p className="text-gray-400">Create and manage discounts, coupons, and product bundles</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/promotions/create"
            className="px-4 py-2 bg-[#00ff99] text-black rounded-xl hover:bg-[#00cc7a] transition-colors font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            Add Promotion
          </Link>
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
              <Tag className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Promotions</p>
              <p className="text-white text-xl font-bold">{promotionStats.total}</p>
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
              <Gift className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-white text-xl font-bold">{promotionStats.active}</p>
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
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Calendar className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Expired</p>
              <p className="text-white text-xl font-bold">{promotionStats.expired}</p>
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
              <Users className="text-[#00ff99]" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Usage</p>
              <p className="text-white text-xl font-bold">{promotionStats.totalUsage}</p>
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
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
        >
          <option value="all">All Types</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
          <option value="bundle">Bundle</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive/Expired</option>
        </select>
      </div>

      {/* Promotions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f0f0f] border-b border-[#2f2f2f]">
              <tr>
                <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Value</th>
                <th className="text-left p-4 text-gray-400 font-medium">Code</th>
                <th className="text-left p-4 text-gray-400 font-medium">Usage</th>
                <th className="text-left p-4 text-gray-400 font-medium">Period</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.map((promotion, index) => (
                <motion.tr
                  key={promotion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-[#2f2f2f] hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{promotion.name}</p>
                      <p className="text-gray-400 text-sm">{promotion.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(promotion.type)}`}>
                      {getTypeIcon(promotion.type)}
                      {promotion.type.charAt(0).toUpperCase() + promotion.type.slice(1)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white font-medium">{formatValue(promotion)}</span>
                  </td>
                  <td className="p-4">
                    {promotion.code ? (
                      <div className="flex items-center gap-2">
                        <code className="bg-[#2f2f2f] text-[#00ff99] px-2 py-1 rounded text-sm font-mono">
                          {promotion.code}
                        </code>
                        <button
                          onClick={() => copyToClipboard(promotion.code!)}
                          className="text-gray-400 hover:text-white p-1 rounded"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span className="text-white">{promotion.usageCount}</span>
                      {promotion.usageLimit && (
                        <span className="text-gray-400">/{promotion.usageLimit}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <p className="text-white">{formatDate(promotion.startDate)}</p>
                      <p className="text-gray-400">to {formatDate(promotion.endDate)}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(promotion)}`}>
                      {getStatusText(promotion)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <Link 
                        href={`/dashboard/promotions/edit/${promotion.id}`}
                        className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                        title="Edit Promotion"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                        title="Delete Promotion"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this promotion?')) {
                            console.log('Delete promotion:', promotion.id);
                            // Add delete functionality here
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <Gift size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No promotions found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;