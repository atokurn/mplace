'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Tag,
  Package,
  Calendar,
  Hash
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  type: 'category' | 'tag';
}

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Graphics & Design',
        description: 'Vector graphics, illustrations, and design assets',
        slug: 'graphics-design',
        productCount: 245,
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        type: 'category'
      },
      {
        id: '2',
        name: 'UI/UX Templates',
        description: 'Modern UI kits and UX design templates',
        slug: 'ui-ux-templates',
        productCount: 189,
        status: 'active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        type: 'category'
      },
      {
        id: '3',
        name: 'Icons & Symbols',
        description: 'Icon sets and symbol collections',
        slug: 'icons-symbols',
        productCount: 156,
        status: 'active',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-16',
        type: 'category'
      },
      {
        id: '4',
        name: 'Backgrounds',
        description: 'Abstract and textured background collections',
        slug: 'backgrounds',
        productCount: 134,
        status: 'active',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-14',
        type: 'category'
      },
      {
        id: '5',
        name: 'Typography',
        description: 'Font families and typography assets',
        slug: 'typography',
        productCount: 89,
        status: 'inactive',
        createdAt: '2024-01-03',
        updatedAt: '2024-01-12',
        type: 'category'
      },
      {
        id: '6',
        name: '3D Models',
        description: '3D assets and model collections',
        slug: '3d-models',
        productCount: 67,
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10',
        type: 'category'
      },
      {
        id: '7',
        name: 'Modern',
        description: 'Contemporary and sleek design style',
        slug: 'modern',
        productCount: 89,
        status: 'active',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        type: 'tag'
      },
      {
        id: '8',
        name: 'Minimalist',
        description: 'Clean and simple design approach',
        slug: 'minimalist',
        productCount: 156,
        status: 'active',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18',
        type: 'tag'
      },
      {
        id: '9',
        name: 'Colorful',
        description: 'Vibrant and bright color schemes',
        slug: 'colorful',
        productCount: 78,
        status: 'active',
        createdAt: '2024-01-16',
        updatedAt: '2024-01-16',
        type: 'tag'
      },
      {
        id: '10',
        name: 'Professional',
        description: 'Business and corporate style',
        slug: 'professional',
        productCount: 134,
        status: 'active',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14',
        type: 'tag'
      },
      {
        id: '11',
        name: 'Creative',
        description: 'Artistic and innovative designs',
        slug: 'creative',
        productCount: 92,
        status: 'active',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12',
        type: 'tag'
      },
      {
        id: '12',
        name: 'Vintage',
        description: 'Retro and classic design elements',
        slug: 'vintage',
        productCount: 45,
        status: 'inactive',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
        type: 'tag'
      }
    ];

    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || category.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const categoriesOnly = filteredCategories.filter(item => item.type === 'category');
  const tagsOnly = filteredCategories.filter(item => item.type === 'tag');

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
        : cat
    ));
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff99] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories & Tags</h1>
          <p className="text-gray-400 mt-1">Manage product categories and tags for filtering & SEO</p>
        </div>
        
        <div className="flex gap-3">
          <Link
            href="/dashboard/categories/add?type=category"
            className="bg-[#00ff99] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#00cc7a] transition-colors flex items-center gap-2 w-fit"
          >
            <Package size={20} />
            Add Category
          </Link>
          <Link
            href="/dashboard/categories/add?type=tag"
            className="bg-[#2f2f2f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3f3f3f] transition-colors flex items-center gap-2 w-fit border border-[#4f4f4f]"
          >
            <Hash size={20} />
            Add Tag
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0f0f0f] border border-[#2f2f2f] rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl p-1">
          <TabsTrigger 
            value="categories" 
            className="data-[state=active]:bg-[#00ff99] data-[state=active]:text-black text-gray-400 rounded-lg font-medium transition-all"
          >
            <Package size={16} className="mr-2" />
            Categories ({categoriesOnly.length})
          </TabsTrigger>
          <TabsTrigger 
            value="tags" 
            className="data-[state=active]:bg-[#00ff99] data-[state=active]:text-black text-gray-400 rounded-lg font-medium transition-all"
          >
            <Hash size={16} className="mr-2" />
            Tags ({tagsOnly.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6 space-y-6">
          {/* Categories Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#00ff99]/10">
                  <Package size={24} className="text-[#00ff99]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{categoriesOnly.length}</h3>
                  <p className="text-gray-400 text-sm">Total Categories</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Package size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {categoriesOnly.filter(cat => cat.status === 'active').length}
                  </h3>
                  <p className="text-gray-400 text-sm">Active Categories</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Package size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {categoriesOnly.reduce((sum, cat) => sum + cat.productCount, 0)}
                  </h3>
                  <p className="text-gray-400 text-sm">Products in Categories</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesOnly.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f] hover:border-[#00ff99]/30 transition-all group"
              >
                {/* Category Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#00ff99]/10">
                      <Package size={20} className="text-[#00ff99]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#00ff99] transition-colors">
                        {category.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        category.status === 'active'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {category.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2f2f2f] transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {/* Category Info */}
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm line-clamp-2">{category.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Package size={14} />
                      <span>{category.productCount} products</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} />
                      <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Slug: <span className="font-mono">{category.slug}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#2f2f2f]">
                  <button
                    onClick={() => router.push(`/dashboard/categories/${category.id}`)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0f0f0f] text-gray-400 hover:text-white hover:bg-[#2f2f2f] transition-colors text-sm"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  
                  <button
                    onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0f0f0f] text-gray-400 hover:text-white hover:bg-[#2f2f2f] transition-colors text-sm"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      category.status === 'active'
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    }`}
                  >
                    {category.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm ml-auto"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State for Categories */}
          {categoriesOnly.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#2f2f2f] rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No categories found</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first category</p>
              <Link
                href="/dashboard/categories/add?type=category"
                className="bg-[#00ff99] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#00cc7a] transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Category
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tags" className="mt-6 space-y-6">
          {/* Tags Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Hash size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{tagsOnly.length}</h3>
                  <p className="text-gray-400 text-sm">Total Tags</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Hash size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {tagsOnly.filter(tag => tag.status === 'active').length}
                  </h3>
                  <p className="text-gray-400 text-sm">Active Tags</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Package size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {tagsOnly.reduce((sum, tag) => sum + tag.productCount, 0)}
                  </h3>
                  <p className="text-gray-400 text-sm">Products with Tags</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tagsOnly.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2f2f2f] hover:border-purple-500/30 transition-all group"
              >
                {/* Tag Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Hash size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {tag.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tag.status === 'active'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {tag.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2f2f2f] transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {/* Tag Info */}
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm line-clamp-2">{tag.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Package size={14} />
                      <span>{tag.productCount} products</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Slug: <span className="font-mono">{tag.slug}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#2f2f2f] flex-wrap">
                  <button
                    onClick={() => router.push(`/dashboard/categories/${tag.id}/edit`)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0f0f0f] text-gray-400 hover:text-white hover:bg-[#2f2f2f] transition-colors text-sm"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(tag.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      tag.status === 'active'
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    }`}
                  >
                    {tag.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteCategory(tag.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State for Tags */}
          {tagsOnly.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#2f2f2f] rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No tags found</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first tag</p>
              <Link
                href="/dashboard/categories/add?type=tag"
                className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Tag
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default CategoriesPage;