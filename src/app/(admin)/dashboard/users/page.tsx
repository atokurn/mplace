"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  User,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { FloatingActionBar } from '@/components/data-table/floating-action-bar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
}

const data: User[] = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:20:00Z',
    totalOrders: 15,
    totalSpent: 450.75
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-14T16:45:00Z',
    lastLogin: '2024-01-19T09:15:00Z',
    totalOrders: 8,
    totalSpent: 234.50
  },
  {
    id: 'USR-003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-13T09:15:00Z',
    lastLogin: '2024-01-18T16:30:00Z',
    totalOrders: 22,
    totalSpent: 678.90
  },
  {
    id: 'USR-004',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'user',
    isActive: false,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-12T14:20:00Z',
    lastLogin: '2024-01-15T11:45:00Z',
    totalOrders: 3,
    totalSpent: 89.25
  }
];

function UsersPage() {
  const [name] = useQueryState('name', parseAsString.withDefault(''));
  const [role] = useQueryState(
    'role',
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [status] = useQueryState(
    'status',
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter data based on query parameters
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchesName =
        name === '' ||
        user.name.toLowerCase().includes(name.toLowerCase()) ||
        user.email.toLowerCase().includes(name.toLowerCase());
      const matchesRole = role.length === 0 || role.includes(user.role);
      const matchesStatus = status.length === 0 || status.includes(user.isActive ? 'active' : 'inactive');

      return matchesName && matchesRole && matchesStatus;
    });
  }, [name, role, status]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-[#2f2f2f] text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-white">{user.name}</div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </div>
              </div>
            </div>
          );
        },
        meta: {
          label: 'User Name',
          placeholder: 'Search users...',
          variant: 'text'
        },
        enableColumnFilter: true,
      },
      {
        id: 'role',
        accessorKey: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
          const role = row.getValue('role') as string;
          const variants = {
            admin: 'bg-red-500/20 text-red-400 border-red-500/30',
            user: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          };
          
          return (
            <Badge className={`${variants[role as keyof typeof variants]} border`}>
              {role === 'admin' && <Shield className="mr-1 h-3 w-3" />}
              {role === 'user' && <User className="mr-1 h-3 w-3" />}
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          );
        },
        meta: {
          label: 'Role',
          variant: 'multiSelect',
          placeholder: 'Select roles...',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' }
          ]
        },
        enableColumnFilter: true,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const user = row.original;
          const isActive = user.isActive;
          
          return (
            <Badge className={`${isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'} border`}>
              {isActive ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
        meta: {
          label: 'Status',
          variant: 'multiSelect',
          placeholder: 'Select status...',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]
        },
        enableColumnFilter: true,
      },
      {
        id: 'totalOrders',
        accessorKey: 'totalOrders',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Orders" />
        ),
        cell: ({ row }) => {
          const orders = row.getValue('totalOrders') as number;
          return <div className="text-center">{orders}</div>;
        },
      },
      {
        id: 'totalSpent',
        accessorKey: 'totalSpent',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Total Spent" />
        ),
        cell: ({ row }) => {
          const amount = row.getValue('totalSpent') as number;
          return (
            <div className="font-medium">
              ${amount.toFixed(2)}
            </div>
          );
        },
      },
      {
        id: 'actions',
        cell: function Cell({ row }) {
          const user = row.original;
          
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    []
  );

  // Set loading to false immediately
  useEffect(() => {
    setLoading(false);
  }, []);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'name', desc: false }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => row.id,
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header - Static, always visible */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <p className="text-gray-400 mt-1">Manage user accounts and permissions</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Stats Cards Skeleton - Dynamic content only */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-[#1f1f1f] border-[#2f2f2f]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Table Skeleton - Dynamic content only */}
        <DataTableSkeleton
          columnCount={7}
          rowCount={8}
          filterCount={3}
          cellWidths={["3rem", "15rem", "8rem", "8rem", "8rem", "8rem", "4rem"]}
          withViewOptions={true}
          withPagination={true}
        />
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-400 mt-1">Manage user accounts and permissions</p>
        </div>
        <Button className="bg-[#00ff99] text-black hover:bg-[#00ff99]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#00ff99]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.length}</div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.filter(u => u.isActive).length}
            </div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-xs text-gray-500">Admin users</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Suspended</CardTitle>
            <UserX className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.filter(u => !u.isActive).length}
            </div>
            <p className="text-xs text-gray-500">Suspended users</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Users</CardTitle>
              <CardDescription className="text-gray-400">
                Manage user accounts and permissions.
              </CardDescription>
            </div>
            <Button className="bg-[#00ff99] text-black hover:bg-[#00ff99]/90">
              <Plus className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

      {/* Users Table */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f]">

        <CardContent>
          <div className="pb-4">
          <DataTableToolbar table={table} />
          </div>
          <DataTable table={table} />
        </CardContent>
      </Card>

      {/* Floating Action Bar */}
      <FloatingActionBar
        table={table}
        onExport={() => {
          console.log('Exporting users...');
          // TODO: Implement export functionality
        }}
        onBulkDelete={(selectedIds) => {
          console.log('Bulk deleting users:', selectedIds);
          // TODO: Implement bulk delete functionality
        }}
        onBulkEdit={(selectedIds) => {
          console.log('Bulk editing users:', selectedIds);
          // TODO: Implement bulk edit functionality
        }}
        exportLabel="Export Users"
      />
    </div>
  );
};

export default UsersPage;