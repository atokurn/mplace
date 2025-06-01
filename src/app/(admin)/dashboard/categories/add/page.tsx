'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  X,
  Tag,
  FileText,
  Link as LinkIcon,
  Eye,
  EyeOff,
  AlertCircle,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  metaTitle: string;
  metaDescription: string;
  parentCategory: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const AddCategoryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    slug: '',
    status: 'active',
    metaTitle: '',
    metaDescription: '',
    parentCategory: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Mock parent categories - replace with actual API call
  const parentCategories = [
    { id: '1', name: 'Graphics & Design' },
    { id: '2', name: 'UI/UX Templates' },
    { id: '3', name: 'Icons & Symbols' },
    { id: '4', name: 'Backgrounds' }
  ];

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(value) : prev.slug,
      metaTitle: prev.metaTitle === '' ? value : prev.metaTitle
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = 'Meta title should be under 60 characters';
    }

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description should be under 160 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Here you would make the actual API call
      console.log('Creating category:', formData);
      
      // Redirect to categories page
      router.push('/dashboard/categories');
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some(value => value.trim() !== '')) {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        router.push('/dashboard/categories');
      }
    } else {
      router.push('/dashboard/categories');
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-[#1a1a1a] border border-[#2f2f2f] text-gray-400 hover:text-white hover:border-[#00ff99]/30 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Category</h1>
          <p className="text-gray-400 mt-1">Create a new category to organize your products</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#2f2f2f] text-gray-400 hover:text-white hover:border-[#00ff99]/30 transition-colors"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#00ff99]/10">
                  <Tag size={20} className="text-[#00ff99]" />
                </div>
                <h2 className="text-lg font-semibold text-white">Basic Information</h2>
              </div>

              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter category name"
                    className={`w-full bg-[#0f0f0f] border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-400' : 'border-[#2f2f2f] focus:border-[#00ff99]'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this category contains"
                    rows={4}
                    className={`w-full bg-[#0f0f0f] border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors resize-none ${
                      errors.description ? 'border-red-500 focus:border-red-400' : 'border-[#2f2f2f] focus:border-[#00ff99]'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL Slug *
                  </label>
                  <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="category-url-slug"
                      className={`w-full bg-[#0f0f0f] border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors font-mono text-sm ${
                        errors.slug ? 'border-red-500 focus:border-red-400' : 'border-[#2f2f2f] focus:border-[#00ff99]'
                      }`}
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.slug}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    URL: /categories/{formData.slug || 'category-slug'}
                  </p>
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Parent Category
                  </label>
                  <select
                    value={formData.parentCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentCategory: e.target.value }))}
                    className="w-full bg-[#0f0f0f] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">No parent category</option>
                    {parentCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-500 text-xs mt-1">
                    Optional: Select a parent category to create a subcategory
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                        className="text-[#00ff99] focus:ring-[#00ff99] focus:ring-2"
                      />
                      <span className="text-white">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === 'inactive'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                        className="text-[#00ff99] focus:ring-[#00ff99] focus:ring-2"
                      />
                      <span className="text-white">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SEO Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FileText size={20} className="text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
                <span className="text-xs bg-[#2f2f2f] text-gray-400 px-2 py-1 rounded-full">Optional</span>
              </div>

              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="SEO title for search engines"
                    className={`w-full bg-[#0f0f0f] border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors ${
                      errors.metaTitle ? 'border-red-500 focus:border-red-400' : 'border-[#2f2f2f] focus:border-[#00ff99]'
                    }`}
                  />
                  {errors.metaTitle && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.metaTitle}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.metaTitle.length}/60 characters
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="Brief description for search engine results"
                    rows={3}
                    className={`w-full bg-[#0f0f0f] border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors resize-none ${
                      errors.metaDescription ? 'border-red-500 focus:border-red-400' : 'border-[#2f2f2f] focus:border-[#00ff99]'
                    }`}
                  />
                  {errors.metaDescription && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.metaDescription}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <button
                type="submit"
                disabled={loading}
                className="bg-[#00ff99] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#00cc7a] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Category
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="bg-[#1a1a1a] border border-[#2f2f2f] text-gray-400 px-8 py-3 rounded-xl font-semibold hover:text-white hover:border-[#00ff99]/30 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Cancel
              </button>
            </motion.div>
          </form>
        </div>

        {/* Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f] sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Eye size={16} />
                Preview
              </h3>
              
              <div className="space-y-4">
                {/* Category Card Preview */}
                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#2f2f2f]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#00ff99]/10">
                        <Tag size={16} className="text-[#00ff99]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {formData.name || 'Category Name'}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          formData.status === 'active'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-xs mb-3">
                    {formData.description || 'Category description will appear here...'}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    Slug: <span className="font-mono">{formData.slug || 'category-slug'}</span>
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#2f2f2f]">
                  <h4 className="text-sm font-semibold text-white mb-2">Search Engine Preview</h4>
                  <div className="space-y-1">
                    <div className="text-blue-400 text-sm hover:underline cursor-pointer">
                      {formData.metaTitle || formData.name || 'Category Title'}
                    </div>
                    <div className="text-green-600 text-xs">
                      yoursite.com/categories/{formData.slug || 'category-slug'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formData.metaDescription || formData.description || 'Category description for search engines...'}
                    </div>
                  </div>
                </div>

                {/* Form Validation Status */}
                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#2f2f2f]">
                  <h4 className="text-sm font-semibold text-white mb-2">Form Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      {formData.name ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <X size={12} className="text-red-400" />
                      )}
                      <span className={formData.name ? 'text-green-400' : 'text-red-400'}>
                        Category name
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {formData.description ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <X size={12} className="text-red-400" />
                      )}
                      <span className={formData.description ? 'text-green-400' : 'text-red-400'}>
                        Description
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {formData.slug ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <X size={12} className="text-red-400" />
                      )}
                      <span className={formData.slug ? 'text-green-400' : 'text-red-400'}>
                        URL slug
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddCategoryPage;