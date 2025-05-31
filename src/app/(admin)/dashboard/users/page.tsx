'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
  joinedAt: string;
  lastLogin: string;
  totalPurchases: number;
  totalSpent: number;
  avatar?: string;
}

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        role: 'user',
        status: 'active',
        joinedAt: '2024-01-15',
        lastLogin: '2024-01-20',
        totalPurchases: 12,
        totalSpent: 245.50,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'moderator',
        status: 'active',
        joinedAt: '2024-01-10',
        lastLogin: '2024-01-19',
        totalPurchases: 8,
        totalSpent: 189.99
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '+1 234 567 8901',
        role: 'user',
        status: 'inactive',
        joinedAt: '2024-01-08',
        lastLogin: '2024-01-12',
        totalPurchases: 3,
        totalSpent: 75.00
      },
      {
        id: '4',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        joinedAt: '2023-12-01',
        lastLogin: '2024-01-20',
        totalPurchases: 0,
        totalSpent: 0
      }
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus = !selectedStatus || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roles = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'user', label: 'User' }
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'banned', label: 'Banned' }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/20';
      case 'moderator': return 'text-blue-400 bg-blue-400/20';
      case 'user': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'inactive': return 'text-yellow-400 bg-yellow-400/20';
      case 'banned': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck size={16} />;
      case 'moderator': return <Shield size={16} />;
      default: return null;
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: newStatus as any } : u
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff99] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
            <p className="text-gray-400">Manage user accounts and permissions</p>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/users/add')}
            className="flex items-center gap-2 px-6 py-3 bg-[#00ff99] text-black rounded-xl font-medium hover:bg-[#00cc77] transition-colors mt-4 md:mt-0"
          >
            <UserPlus size={20} />
            Add User
          </button>
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
                  placeholder="Search users..."
                  className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff99] transition-colors"
                />
              </div>
            </div>
            
            {/* Role Filter */}
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff99] transition-colors"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
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

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="bg-[#0f0f0f] rounded-2xl p-12 border border-[#2f2f2f] text-center">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="bg-[#0f0f0f] rounded-2xl border border-[#2f2f2f] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-[#2f2f2f] text-sm font-medium text-gray-400">
              <div className="col-span-3">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Purchases</div>
              <div className="col-span-2">Last Login</div>
              <div className="col-span-1">Actions</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-[#2f2f2f]">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 p-6 hover:bg-[#1a1a1a] transition-colors"
                >
                  {/* User Info */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2a2a2a] rounded-full flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      {user.phone && (
                        <p className="text-gray-500 text-xs">{user.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Role */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border-none focus:outline-none ${getStatusColor(user.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                  
                  {/* Purchases */}
                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className="text-white font-medium">{user.totalPurchases}</p>
                      <p className="text-gray-400 text-sm">${user.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Last Login */}
                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className="text-white text-sm">{new Date(user.lastLogin).toLocaleDateString()}</p>
                      <p className="text-gray-400 text-xs">{new Date(user.lastLogin).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-1 flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                      className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3a3a3a] transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
                      className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3a3a3a] transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <UserPlus className="text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-gray-400 text-sm">Total Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-green-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-gray-400 text-sm">Active Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Shield className="text-yellow-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'moderator').length}</p>
                <p className="text-gray-400 text-sm">Moderators</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-[#2f2f2f]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Ban className="text-red-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'banned').length}</p>
                <p className="text-gray-400 text-sm">Banned Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;