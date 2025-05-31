'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Calendar,
  Percent,
  DollarSign,
  Package,
  Tag,
  Gift,
  Info,
  Users,
  ShoppingCart,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface PromotionFormData {
  name: string;
  type: 'percentage' | 'fixed' | 'bundle';
  value: number;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  isActive: boolean;
  minimumAmount: number | null;
  applicableProducts: string[];
  usageCount: number;
}

const EditPromotionPage = () => {
  const router = useRouter();
  const params = useParams();
  const promotionId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<PromotionFormData>({
    name: '',
    type: 'percentage',
    value: 0,
    code: '',
    description: '',
    startDate: '',
    endDate: '',
    usageLimit: null,
    isActive: true,
    minimumAmount: null,
    applicableProducts: [],
    usageCount: 0
  });

  const [errors, setErrors] = useState<Partial<PromotionFormData>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load promotion data
  useEffect(() => {
    const loadPromotion = async () => {
      try {
        // Mock data - replace with actual API call
        const mockPromotions = {
          'PROMO-001': {
            id: 'PROMO-001',
            name: 'New Year Sale',
            type: 'percentage' as const,
            value: 25,
            code: 'NEWYEAR25',
            description: '25% off on all digital assets',
            startDate: '2024-01-01T00:00',
            endDate: '2024-01-31T23:59',
            usageLimit: 100,
            usageCount: 45,
            isActive: true,
            minimumAmount: 20,
            applicableProducts: []
          },
          'PROMO-002': {
            id: 'PROMO-002',
            name: 'First Time Buyer',
            type: 'fixed' as const,
            value: 10,
            code: 'WELCOME10',
            description: '$10 off for new customers',
            startDate: '2024-01-01T00:00',
            endDate: '2024-12-31T23:59',
            usageLimit: 500,
            usageCount: 123,
            isActive: true,
            minimumAmount: 30,
            applicableProducts: []
          }
        };

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const promotion = mockPromotions[promotionId as keyof typeof mockPromotions];
        if (promotion) {
          setFormData({
            name: promotion.name,
            type: promotion.type,
            value: promotion.value,
            code: promotion.code,
            description: promotion.description,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
            usageLimit: promotion.usageLimit,
            isActive: promotion.isActive,
            minimumAmount: promotion.minimumAmount,
            applicableProducts: promotion.applicableProducts,
            usageCount: promotion.usageCount
          });
        } else {
          // Promotion not found, redirect to promotions page
          router.push('/dashboard/promotions');
        }
      } catch (error) {
        console.error('Error loading promotion:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (promotionId) {
      loadPromotion();
    }
  }, [promotionId, router]);

  const validateForm = () => {
    const newErrors: Partial<PromotionFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.value <= 0) newErrors.value = 'Value must be greater than 0';
    if (formData.type !== 'bundle' && !formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.type === 'percentage' && formData.value > 100) {
      newErrors.value = 'Percentage cannot exceed 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make the actual API call to update the promotion
      console.log('Updating promotion:', { id: promotionId, ...formData });
      
      // Redirect to promotions page
      router.push('/dashboard/promotions');
    } catch (error) {
      console.error('Error updating promotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call to delete the promotion
      console.log('Deleting promotion:', promotionId);
      
      // Redirect to promotions page
      router.push('/dashboard/promotions');
    } catch (error) {
      console.error('Error deleting promotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PromotionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const generateCode = () => {
    const code = formData.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8) + Math.floor(Math.random() * 100);
    handleInputChange('code', code);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent size={20} />;
      case 'fixed': return <DollarSign size={20} />;
      case 'bundle': return <Package size={20} />;
      default: return <Tag size={20} />;
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff99]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/promotions"
            className="p-2 rounded-xl bg-[#2f2f2f] hover:bg-[#3f3f3f] transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Promotion</h1>
            <p className="text-gray-400">Update promotion details</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Usage Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Usage Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#2f2f2f] rounded-xl p-4">
            <div className="text-2xl font-bold text-[#00ff99]">{formData.usageCount}</div>
            <div className="text-gray-400 text-sm">Times Used</div>
          </div>
          <div className="bg-[#2f2f2f] rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">
              {formData.usageLimit ? `${formData.usageLimit - formData.usageCount}` : '∞'}
            </div>
            <div className="text-gray-400 text-sm">Remaining Uses</div>
          </div>
          <div className="bg-[#2f2f2f] rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">
              {formData.usageLimit ? `${Math.round((formData.usageCount / formData.usageLimit) * 100)}%` : 'N/A'}
            </div>
            <div className="text-gray-400 text-sm">Usage Rate</div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Info size={20} className="text-[#00ff99]" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Promotion Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-[#2f2f2f] border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99] ${
                    errors.name ? 'border-red-500' : 'border-[#3f3f3f]'
                  }`}
                  placeholder="e.g., New Year Sale"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Promotion Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as 'percentage' | 'fixed' | 'bundle')}
                  className="w-full px-4 py-3 bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00ff99]"
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed">Fixed Amount Discount</option>
                  <option value="bundle">Bundle Deal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 bg-[#2f2f2f] border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99] resize-none ${
                  errors.description ? 'border-red-500' : 'border-[#3f3f3f]'
                }`}
                placeholder="Describe your promotion..."
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Promotion Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {getTypeIcon(formData.type)}
              <span className="text-[#00ff99]">Promotion Details</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {formData.type === 'percentage' ? 'Discount Percentage (%)' : 
                   formData.type === 'fixed' ? 'Discount Amount ($)' : 
                   'Bundle Discount (%)'} *
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.type === 'percentage' ? "100" : undefined}
                  step={formData.type === 'fixed' ? "0.01" : "1"}
                  value={formData.value || ''}
                  onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 bg-[#2f2f2f] border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99] ${
                    errors.value ? 'border-red-500' : 'border-[#3f3f3f]'
                  }`}
                  placeholder={formData.type === 'percentage' ? '25' : formData.type === 'fixed' ? '10.00' : '40'}
                />
                {errors.value && <p className="text-red-400 text-sm mt-1">{errors.value}</p>}
              </div>

              {formData.type !== 'bundle' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Promotion Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                      className={`flex-1 px-4 py-3 bg-[#2f2f2f] border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99] ${
                        errors.code ? 'border-red-500' : 'border-[#3f3f3f]'
                      }`}
                      placeholder="NEWYEAR25"
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-4 py-3 bg-[#00ff99] text-black rounded-xl hover:bg-[#00cc7a] transition-colors font-medium"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.code && <p className="text-red-400 text-sm mt-1">{errors.code}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar size={20} className="text-[#00ff99]" />
              Date Range
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-4 py-3 bg-[#2f2f2f] border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00ff99] ${
                    errors.startDate ? 'border-red-500' : 'border-[#3f3f3f]'
                  }`}
                />
                {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-4 py-3 bg-[#2f2f2f] border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00ff99] ${
                    errors.endDate ? 'border-red-500' : 'border-[#3f3f3f]'
                  }`}
                />
                {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users size={20} className="text-[#00ff99]" />
              Usage Limits
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.usageLimit || ''}
                  onChange={(e) => handleInputChange('usageLimit', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99]"
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Order Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minimumAmount || ''}
                  onChange={(e) => handleInputChange('minimumAmount', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-4 py-3 bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff99]"
                  placeholder="Leave empty for no minimum"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Gift size={20} className="text-[#00ff99]" />
              Status
            </h2>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-5 h-5 text-[#00ff99] bg-[#2f2f2f] border-[#3f3f3f] rounded focus:ring-[#00ff99] focus:ring-2"
              />
              <label htmlFor="isActive" className="text-gray-300">
                Promotion is active
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-[#2f2f2f]">
            <Link
              href="/dashboard/promotions"
              className="px-6 py-3 bg-[#2f2f2f] text-white rounded-xl hover:bg-[#3f3f3f] transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#00ff99] text-black rounded-xl hover:bg-[#00cc7a] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              ) : (
                <Save size={20} />
              )}
              {loading ? 'Updating...' : 'Update Promotion'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f] max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Promotion</h3>
            </div>
            
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this promotion? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-[#2f2f2f] text-white rounded-xl hover:bg-[#3f3f3f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 size={16} />
                )}
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EditPromotionPage;