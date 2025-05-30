'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Ban, 
  CheckCircle, 
  X, 
  Save,
  User,
  Mail,
  Calendar,
  Shield,
  Download,
  DollarSign
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'creator';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastLogin: string;
  totalPurchases: number;
  totalSpent: number;
  downloads: number;
}

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/placeholder.svg',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      totalPurchases: 12,
      totalSpent: 340,
      downloads: 45
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/placeholder.svg',
      role: 'creator',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19',
      totalPurchases: 8,
      totalSpent: 220,
      downloads: 32
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: '/placeholder.svg',
      role: 'user',
      status: 'suspended',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-18',
      totalPurchases: 3,
      totalSpent: 75,
      downloads: 15
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: '/placeholder.svg',
      role: 'admin',
      status: 'active',
      joinDate: '2023-12-01',
      lastLogin: '2024-01-20',
      totalPurchases: 25,
      totalSpent: 680,
      downloads: 120
    },
    {
      id: 5,
      name: 'Alex Brown',
      email: 'alex@example.com',
      avatar: '/placeholder.svg',
      role: 'user',
      status: 'pending',
      joinDate: '2024-01-20',
      lastLogin: 'Never',
      totalPurchases: 0,
      totalSpent: 0,
      downloads: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const roles = ['admin', 'creator', 'user'];
  const statuses = ['active', 'suspended', 'pending'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusChange = (id: number, status: 'active' | 'suspended' | 'pending') => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };

  const handleRoleChange = (id: number, role: 'admin' | 'user' | 'creator') => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500 text-white';
      case 'creator': return 'bg-blue-500 text-white';
      case 'user': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'suspended': return 'bg-red-500 text-white';
      case 'pending': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>Total Users: {users.length}</span>
          <span>Active: {users.filter(u => u.status === 'active').length}</span>
          <span>Suspended: {users.filter(u => u.status === 'suspended').length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00ff99] focus:outline-none transition-colors"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2f2f2f] rounded-xl px-4 py-3 text-white focus:border-[#00ff99] focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2f2f2f]">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">User</th>
                <th className="text-left p-4 text-gray-300 font-medium">Role</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Join Date</th>
                <th className="text-left p-4 text-gray-300 font-medium">Last Login</th>
                <th className="text-left p-4 text-gray-300 font-medium">Purchases</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-[#2f2f2f] hover:bg-[#2f2f2f] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} focus:outline-none`}
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)} focus:outline-none`}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-gray-300">{user.joinDate}</td>
                  <td className="p-4 text-gray-300">{user.lastLogin}</td>
                  <td className="p-4">
                    <div className="text-sm">
                      <p className="text-white">{user.totalPurchases} items</p>
                      <p className="text-gray-400">${user.totalSpent}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewUserDetails(user)}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete User"
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
      </div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#2f2f2f] p-12 text-center"
        >
          <User className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No Users Found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
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
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-white">{selectedUser.name}</h4>
                    <p className="text-gray-400">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#2f2f2f] rounded-xl p-4 text-center">
                    <Calendar className="mx-auto text-[#00ff99] mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Join Date</p>
                    <p className="text-white font-bold">{selectedUser.joinDate}</p>
                  </div>
                  <div className="bg-[#2f2f2f] rounded-xl p-4 text-center">
                    <Shield className="mx-auto text-blue-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Last Login</p>
                    <p className="text-white font-bold">{selectedUser.lastLogin}</p>
                  </div>
                  <div className="bg-[#2f2f2f] rounded-xl p-4 text-center">
                    <Download className="mx-auto text-purple-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Downloads</p>
                    <p className="text-white font-bold">{selectedUser.downloads}</p>
                  </div>
                  <div className="bg-[#2f2f2f] rounded-xl p-4 text-center">
                    <DollarSign className="mx-auto text-yellow-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Total Spent</p>
                    <p className="text-white font-bold">${selectedUser.totalSpent}</p>
                  </div>
                </div>

                {/* Purchase History */}
                <div>
                  <h5 className="text-lg font-bold text-white mb-4">Purchase Summary</h5>
                  <div className="bg-[#2f2f2f] rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Total Purchases:</span>
                      <span className="text-white font-bold">{selectedUser.totalPurchases} items</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-[#00ff99] font-bold">${selectedUser.totalSpent}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average per Purchase:</span>
                      <span className="text-white font-bold">
                        ${selectedUser.totalPurchases > 0 ? (selectedUser.totalSpent / selectedUser.totalPurchases).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedUser.id, selectedUser.status === 'active' ? 'suspended' : 'active');
                      closeModal();
                    }}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                      selectedUser.status === 'active' 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteUser(selectedUser.id);
                      closeModal();
                    }}
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManager;