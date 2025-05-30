'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Archive,
  X, 
  Check, 
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadDate: string;
  downloads: number;
  category: 'image' | 'video' | 'document' | 'archive' | 'other';
}

const FileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'abstract-vector-pack.zip',
      size: 2048000,
      type: 'application/zip',
      url: '/files/abstract-vector-pack.zip',
      uploadDate: '2024-01-20',
      downloads: 45,
      category: 'archive'
    },
    {
      id: '2',
      name: 'product-preview.jpg',
      size: 512000,
      type: 'image/jpeg',
      url: '/files/product-preview.jpg',
      uploadDate: '2024-01-19',
      downloads: 23,
      category: 'image'
    },
    {
      id: '3',
      name: 'tutorial-video.mp4',
      size: 15728640,
      type: 'video/mp4',
      url: '/files/tutorial-video.mp4',
      uploadDate: '2024-01-18',
      downloads: 12,
      category: 'video'
    },
    {
      id: '4',
      name: 'documentation.pdf',
      size: 1024000,
      type: 'application/pdf',
      url: '/files/documentation.pdf',
      uploadDate: '2024-01-17',
      downloads: 8,
      category: 'document'
    }
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['image', 'video', 'document', 'archive', 'other'];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'image': return <ImageIcon size={20} />;
      case 'video': return <Video size={20} />;
      case 'document': return <FileText size={20} />;
      case 'archive': return <Archive size={20} />;
      default: return <File size={20} />;
    }
  };

  const getFileCategory = (type: string): 'image' | 'video' | 'document' | 'archive' | 'other' => {
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'archive';
    return 'other';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    simulateUpload(newFiles);
  };

  const simulateUpload = async (fileList: File[]) => {
    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Add file to list
      const newFile: UploadedFile = {
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString().split('T')[0],
        downloads: 0,
        category: getFileCategory(file.type)
      };

      setFiles(prev => [newFile, ...prev]);
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const downloadFile = (file: UploadedFile) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
    
    // Update download count
    setFiles(files.map(f => f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">File Management</h2>
          <p className="text-gray-400">Upload and manage your digital assets</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>Total Files: {files.length}</span>
          <span>Total Size: {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}</span>
        </div>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragActive 
            ? 'border-[#00ff99] bg-[#00ff99]/10' 
            : 'border-[#2f2f2f] hover:border-[#00ff99]/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto">
              <Upload className="text-[#00ff99]" size={48} />
            </div>
            <div>
              <p className="text-white font-medium mb-2">Uploading files...</p>
              <div className="w-full bg-[#2f2f2f] rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="bg-[#00ff99] h-2 rounded-full transition-all duration-300"
                />
              </div>
              <p className="text-gray-400 text-sm mt-2">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto text-gray-400" size={48} />
            <div>
              <p className="text-white font-medium mb-2">Drop files here or click to upload</p>
              <p className="text-gray-400 text-sm">Support for images, videos, documents, and archives</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#00ff99] text-black px-6 py-3 rounded-xl font-medium hover:bg-[#00cc77] transition-colors"
            >
              Choose Files
            </button>
          </div>
        )}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search files..."
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
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFiles.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] overflow-hidden hover:border-[#00ff99] transition-colors group"
          >
            {/* File Preview */}
            <div className="relative h-32 bg-[#2f2f2f] flex items-center justify-center">
              {file.category === 'image' ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">
                  {getFileIcon(file.category)}
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => deleteFile(file.id)}
                  className="bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* File Info */}
            <div className="p-4">
              <h3 className="text-white font-medium mb-1 truncate" title={file.name}>
                {file.name}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                <span>{formatFileSize(file.size)}</span>
                <span>{file.downloads} downloads</span>
              </div>
              <p className="text-gray-400 text-xs mb-4">Uploaded: {file.uploadDate}</p>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadFile(file)}
                  className="flex-1 bg-[#2f2f2f] text-white px-3 py-2 rounded-lg hover:bg-[#3f3f3f] transition-colors flex items-center justify-center space-x-1"
                  title="Download"
                >
                  <Download size={14} />
                  <span className="text-xs">Download</span>
                </button>
                <button
                  onClick={() => copyFileUrl(file.url)}
                  className="bg-[#2f2f2f] text-white px-3 py-2 rounded-lg hover:bg-[#3f3f3f] transition-colors"
                  title="Copy URL"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => window.open(file.url, '_blank')}
                  className="bg-[#2f2f2f] text-white px-3 py-2 rounded-lg hover:bg-[#3f3f3f] transition-colors"
                  title="Preview"
                >
                  <Eye size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-12 text-center"
        >
          <File className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No Files Found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}

      {/* Upload Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-6"
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-[#00ff99] mt-1" size={20} />
          <div>
            <h3 className="text-white font-medium mb-2">Upload Guidelines</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Maximum file size: 50MB per file</li>
              <li>• Supported formats: Images (JPG, PNG, SVG), Videos (MP4, MOV), Documents (PDF, DOC), Archives (ZIP, RAR)</li>
              <li>• Use descriptive filenames for better organization</li>
              <li>• Compress large files to reduce upload time</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUpload;