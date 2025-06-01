'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  File,
  DollarSign,
  Users,
  Building,
  ArrowLeft,
  Save,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'other';
}

interface ProductFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  personalPrice: number;
  commercialPrice: number;
  files: UploadedFile[];
  featured: boolean;
}

const AddProductPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    personalPrice: 0,
    commercialPrice: 0,
    files: [],
    featured: false
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'other';
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: fileType === 'image' ? URL.createObjectURL(file) : '',
        type: fileType
      };
    });

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/*': ['.zip', '.rar', '.psd', '.ai', '.sketch']
    },
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In real implementation, upload files and create product
      console.log('Product data:', formData);
      
      // Redirect to products list
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} />;
      case 'video': return <Video size={20} />;
      default: return <File size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Add New Product</h1>
              <p className="text-gray-400 mt-1">Create a new digital asset for your marketplace</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl hover:bg-[#2a2a2a] transition-colors"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title || formData.files.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-[#00ff99] text-black rounded-xl font-medium hover:bg-[#00cc77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
                  placeholder="Enter product title"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors resize-none"
                  placeholder="Describe your product..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
                >
                  <option value="">Select category</option>
                  <option value="graphics">Graphics</option>
                  <option value="templates">Templates</option>
                  <option value="fonts">Fonts</option>
                  <option value="photos">Photos</option>
                  <option value="videos">Videos</option>
                  <option value="audio">Audio</option>
                  <option value="3d">3D Models</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
                    placeholder="Add tags..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-[#00ff99] text-black rounded-xl font-medium hover:bg-[#00cc77] transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-[#2a2a2a] text-white rounded-lg text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]">
            <h2 className="text-xl font-semibold text-white mb-6">Pricing Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2f2f2f]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Personal Use</h3>
                    <p className="text-sm text-gray-400">For individual projects</p>
                  </div>
                </div>
                
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.personalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, personalPrice: Number(e.target.value) }))}
                    className="w-full bg-[#0f0f0f] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2f2f2f]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Building className="text-green-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Commercial Use</h3>
                    <p className="text-sm text-gray-400">For business projects</p>
                  </div>
                </div>
                
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.commercialPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, commercialPrice: Number(e.target.value) }))}
                    className="w-full bg-[#0f0f0f] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]">
            <h2 className="text-xl font-semibold text-white mb-6">Files & Media</h2>
            
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                isDragActive 
                  ? 'border-[#00ff99] bg-[#00ff99]/5' 
                  : 'border-[#2f2f2f] hover:border-[#00ff99]/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center">
                  <Upload className="text-[#00ff99]" size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-gray-400">
                    or <span className="text-[#00ff99]">browse files</span> to upload
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports: Images, Videos, ZIP, PSD, AI, Sketch files
                  </p>
                </div>
              </div>
            </div>
            
            {/* Uploaded Files */}
            {formData.files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  Uploaded Files ({formData.files.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.files.map(file => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2f2f2f]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <span className="text-sm text-gray-400">
                            {file.type.toUpperCase()}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      {file.type === 'image' && file.preview && (
                        <div className="mb-3">
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div>
                        <p className="text-white text-sm font-medium truncate">
                          {file.file.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]">
            <h2 className="text-xl font-semibold text-white mb-6">Additional Options</h2>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-5 h-5 bg-[#1a1a1a] border border-[#2f2f2f] rounded focus:ring-[#00ff99] focus:ring-2"
              />
              <label htmlFor="featured" className="text-white font-medium">
                Mark as Featured Product
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;