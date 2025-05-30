'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  X, 
  Save,
  Image as ImageIcon,
  Tag,
  DollarSign,
  FileText
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  tags: string[];
  downloads: number;
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Abstract Vector Pack',
      description: 'Collection of modern abstract vector designs',
      category: 'Vector',
      price: 25,
      image: '/placeholder.svg',
      tags: ['abstract', 'vector', 'modern'],
      downloads: 45,
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Minimal Background Set',
      description: 'Clean and minimal background designs',
      category: 'Background',
      price: 15,
      image: '/placeholder.svg',
      tags: ['minimal', 'background', 'clean'],
      downloads: 32,
      createdAt: '2024-01-14',
      status: 'active'
    },
    {
      id: 3,
      name: 'Logo Design Bundle',
      description: 'Professional logo templates',
      category: 'Logo',
      price: 50,
      image: '/placeholder.svg',
      tags: ['logo', 'branding', 'professional'],
      downloads: 28,
      createdAt: '2024-01-13',
      status: 'draft'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    tags: '',
    image: ''
  });

  const categories = ['Vector', 'Background', 'Logo', 'UI Kit', 'Icon', 'Template'];
  const statuses = ['active', 'draft', 'archived'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price > 0) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        price: newProduct.price,
        image: newProduct.image || '/placeholder.svg',
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        downloads: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'draft'
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', description: '', category: '', price: 0, tags: '', image: '' });
      setShowAddModal(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      tags: product.tags.join(', '),
      image: product.image
    });
    setShowAddModal(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.name && newProduct.category && newProduct.price > 0) {
      const updatedProduct: Product = {
        ...editingProduct,
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        price: newProduct.price,
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: newProduct.image || '/placeholder.svg'
      };
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setNewProduct({ name: '', description: '', category: '', price: 0, tags: '', image: '' });
      setEditingProduct(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleStatusChange = (id: number, status: 'active' | 'draft' | 'archived') => {
    setProducts(products.map(p => p.id === id ? { ...p, status } : p));
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setNewProduct({ name: '', description: '', category: '', price: 0, tags: '', image: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Product Management</h2>
          <p className="text-gray-400">Manage your digital products and assets</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-[#00ff99] text-black px-6 py-3 rounded-xl font-medium flex items-center space-x-2 hover:bg-[#00cc77] transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00ff99] focus:outline-none transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] overflow-hidden hover:border-[#00ff99] transition-colors group"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.status === 'active' ? 'bg-green-500 text-white' :
                  product.status === 'draft' ? 'bg-yellow-500 text-black' :
                  'bg-gray-500 text-white'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.category}</p>
                </div>
                <p className="text-[#00ff99] font-bold text-lg">${product.price}</p>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-[#2f2f2f] text-gray-300 px-2 py-1 rounded-lg text-xs">
                    {tag}
                  </span>
                ))}
                {product.tags.length > 3 && (
                  <span className="text-gray-400 text-xs">+{product.tags.length - 3} more</span>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-sm">{product.downloads} downloads</span>
                <span className="text-gray-400 text-sm">{product.createdAt}</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 bg-[#2f2f2f] text-white px-4 py-2 rounded-lg hover:bg-[#3f3f3f] transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <select
                  value={product.status}
                  onChange={(e) => handleStatusChange(product.id, e.target.value as any)}
                  className="bg-[#2f2f2f] text-white px-3 py-2 rounded-lg focus:outline-none"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-12 text-center"
        >
          <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors h-24 resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                    className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                    placeholder="abstract, vector, modern"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full bg-[#2f2f2f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-[#2f2f2f] text-white px-6 py-3 rounded-xl hover:bg-[#3f3f3f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="flex-1 bg-[#00ff99] text-black px-6 py-3 rounded-xl font-medium hover:bg-[#00cc77] transition-colors flex items-center justify-center space-x-2"
                >
                  <Save size={20} />
                  <span>{editingProduct ? 'Update' : 'Add'} Product</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManager;