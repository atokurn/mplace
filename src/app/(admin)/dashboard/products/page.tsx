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
  Star,
  DollarSign,
  Users,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  personalPrice: number;
  commercialPrice: number;
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  sales: number;
  createdAt: string;
  thumbnail?: string;
}

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        title: 'Vibrant Background Collection',
        description: 'A collection of vibrant abstract backgrounds',
        category: 'graphics',
        personalPrice: 12,
        commercialPrice: 25,
        featured: true,
        status: 'active',
        sales: 156,
        createdAt: '2024-01-15',
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: '2',
        title: 'Modern UI Kit',
        description: 'Complete UI kit for modern applications',
        category: 'templates',
        personalPrice: 35,
        commercialPrice: 75,
        featured: false,
        status: 'active',
        sales: 89,
        createdAt: '2024-01-10'
      },
      {
        id: '3',
        title: '3D Sphere Models',
        description: 'High-quality 3D sphere models',
        category: '3d',
        personalPrice: 15,
        commercialPrice: 30,
        featured: false,
        status: 'draft',
        sales: 0,
        createdAt: '2024-01-08'
      }
    ];
    
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'graphics', label: 'Graphics' },
    { value: 'templates', label: 'Templates' },
    { value: 'fonts', label: 'Fonts' },
    { value: 'photos', label: 'Photos' },
    { value: 'videos', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: '3d', label: '3D Models' }
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'draft': return 'text-yellow-400 bg-yellow-400/20';
      case 'archived': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const toggleFeatured = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, featured: !p.featured } : p
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff99] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
            <p className="text-gray-400">Manage your digital assets and marketplace products</p>
          </div>
          
          <Link
            href="/dashboard/products/add"
            className="flex items-center gap-2 px-6 py-3 bg-[#00ff99] text-black rounded-xl font-medium hover:bg-[#00cc77] transition-colors mt-4 md:mt-0"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#0f0f0f] rounded-2xl p-12 border border-[#2f2f2f] text-center">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff99] text-black rounded-xl font-medium hover:bg-[#00cc77] transition-colors"
            >
              <Plus size={20} />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f0f0f] rounded-2xl border border-[#2f2f2f] overflow-hidden hover:border-[#00ff99]/50 transition-colors group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-[#1a1a1a]">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#2a2a2a] rounded-xl flex items-center justify-center">
                        <Eye className="text-gray-400" size={24} />
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </div>
                  
                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star size={16} className="text-black" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  
                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/products/${product.id}`)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-10 h-10 bg-red-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => toggleFeatured(product.id)}
                      className={`ml-3 p-1 rounded-lg transition-colors ${
                        product.featured 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star size={16} fill={product.featured ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  {/* Category */}
                  <div className="mb-4">
                    <span className="px-2 py-1 bg-[#1a1a1a] text-gray-300 rounded-lg text-xs font-medium">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#1a1a1a] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={12} className="text-blue-400" />
                        <span className="text-xs text-gray-400">Personal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-white" />
                        <span className="text-white font-semibold">{product.personalPrice}</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Building size={12} className="text-green-400" />
                        <span className="text-xs text-gray-400">Commercial</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-white" />
                        <span className="text-white font-semibold">{product.commercialPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {product.sales} sales
                    </span>
                    <span className="text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;