'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  CheckCircle,
  XCircle,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Tag,
  FolderOpen,
} from 'lucide-react';
import { useQueryState, parseAsString, parseAsArrayOf } from 'nuqs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { FloatingActionBar } from '@/components/data-table/floating-action-bar';
import { useDataTable } from '@/hooks/use-data-table';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount?: number;
  isActive: boolean;
  createdAt: string;
}

const CategoriesPage = () => {
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsArrayOf(parseAsString).withDefault([]));
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categories = await response.json();
        setData(categories);
        setError(null);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(category => {
      const matchesName = name === '' || category.name.toLowerCase().includes(name.toLowerCase()) ||
                         category.description.toLowerCase().includes(name.toLowerCase());
      const matchesStatus = status.length === 0 || status.includes(category.isActive.toString());
      
      return matchesName && matchesStatus;
    });
  }, [data, name, status]);

  const columns = useMemo<ColumnDef<Category>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2f2f2f]">
              <Tag className="h-5 w-5 text-[#00ff99]" />
            </div>
            <div>
              <div className="font-medium text-white">{category.name}</div>
              <div className="text-sm text-gray-400">{category.id}</div>
            </div>
          </div>
        );
      },
      meta: {
        label: 'Category Name',
        placeholder: 'Search categories...',
        variant: 'text'
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ getValue }) => (
        <span className="text-gray-300 max-w-xs truncate block">{getValue() as string}</span>
      ),
      meta: {
        label: 'Description',
        placeholder: 'Search descriptions...',
        variant: 'text'
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'productCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Products" />
      ),
      cell: ({ getValue }) => (
        <Badge variant="secondary" className="bg-[#2f2f2f] text-white border-[#3f3f3f]">
          {getValue() as number} products
        </Badge>
      ),
      meta: {
        label: 'Product Count',
        variant: 'range',
        placeholder: 'Enter product count range...'
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ getValue }) => {
        const isActive = getValue() as boolean;
        const variants = {
          active: 'bg-green-500/20 text-green-400 border-green-500/30',
          inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
        
        return (
          <Badge className={`${isActive ? variants.active : variants.inactive} border`}>
            {isActive && <CheckCircle className="mr-1 h-3 w-3" />}
            {!isActive && <XCircle className="mr-1 h-3 w-3" />}
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        placeholder: 'Select status...',
        options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' }
        ]
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ getValue }) => (
        <span className="text-gray-300">
          {new Date(getValue() as string).toLocaleDateString()}
        </span>
      ),
      meta: {
        label: 'Created Date',
        variant: 'dateRange'
      },
      enableColumnFilter: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1f1f1f] border-[#2f2f2f]">
              <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#2f2f2f]">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#2f2f2f]">
                <Edit className="mr-2 h-4 w-4" />
                Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#2f2f2f]">
                <Package className="mr-2 h-4 w-4" />
                Toggle Status
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2f2f2f]" />
              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-[#2f2f2f]">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const { table } = useDataTable({
    data: filteredData,
    columns,
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header - Static, always visible */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Categories</h1>
            <p className="text-gray-400 mt-1">Organize your products with categories</p>
          </div>
        </div>

        {/* Stats Cards Skeleton - Dynamic content */}
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

        {/* Data Table Skeleton - Dynamic content */}
        <DataTableSkeleton
          columnCount={7}
          rowCount={10}
          filterCount={2}
          cellWidths={["3rem", "15rem", "20rem", "8rem", "6rem", "12rem", "4rem"]}
          withViewOptions={true}
          withPagination={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 mt-1">Organize your products into categories</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-[#00ff99]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.length}</div>
            <p className="text-xs text-gray-500">+1 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-gray-500">All categories active</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Products</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.reduce((sum, c) => sum + (c.productCount || 0), 0)}
            </div>
            <p className="text-xs text-gray-500">Across all categories</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Products</CardTitle>
            <FolderOpen className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.length > 0 ? Math.round(data.reduce((sum, c) => sum + (c.productCount || 0), 0) / data.length) : 0}
            </div>
            <p className="text-xs text-gray-500">Per category</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Categories</CardTitle>
              <CardDescription className="text-gray-400">
                Manage product categories and organization.
              </CardDescription>
            </div>
            <Button className="bg-[#00ff99] text-black hover:bg-[#00ff99]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableToolbar table={table} />
          <DataTable table={table} />
        </CardContent>
      </Card>

      {/* Floating Action Bar */}
      <FloatingActionBar
        table={table}
        onExport={() => {
          console.log('Exporting categories...');
          // TODO: Implement export functionality
        }}
        onBulkDelete={(selectedIds) => {
          console.log('Bulk deleting categories:', selectedIds);
          // TODO: Implement bulk delete functionality
        }}
        onBulkEdit={(selectedIds) => {
          console.log('Bulk editing categories:', selectedIds);
          // TODO: Implement bulk edit functionality
        }}
        exportLabel="Export Categories"
      />
    </div>
  );
};

export default CategoriesPage;