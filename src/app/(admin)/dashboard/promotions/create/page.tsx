'use client';

import { useState } from 'react';
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
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
}

const CreatePromotionPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    applicableProducts: []
  });

  const [errors, setErrors] = useState<Partial<PromotionFormData>>({});

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
      
      // Here you would make the actual API call to create the promotion
      console.log('Creating promotion:', formData);
      
      // Redirect to promotions page
      router.push('/dashboard/promotions');
    } catch (error) {
      console.error('Error creating promotion:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/promotions"
          className="p-2 rounded-xl bg-[#2f2f2f] hover:bg-[#3f3f3f] transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Promotion</h1>
          <p className="text-gray-400">Add a new promotion to boost sales</p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
                Activate promotion immediately
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
              {loading ? 'Creating...' : 'Create Promotion'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePromotionPage;