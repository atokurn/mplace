'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Filter,
  Download,
  Upload,
  Star,
  ShoppingCart,
  Tag,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { FloatingActionBar } from '@/components/data-table/floating-action-bar';
import { useDataTable } from '@/hooks/use-data-table';
import { useQueryState, parseAsString, parseAsArrayOf } from 'nuqs';

interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  downloadCount: number;
  isActive: boolean;
  imageUrl: string;
  createdAt: string;
  description?: string;
  tags?: string[];
}

const ProductsPage = () => {
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [category, setCategory] = useQueryState('category', parseAsArrayOf(parseAsString).withDefault([]));
  const [status, setStatus] = useQueryState('status', parseAsArrayOf(parseAsString).withDefault([]));
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const result = await response.json();
        setData(result.products || []);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(product => {
      const matchesName = name === '' || product.title.toLowerCase().includes(name.toLowerCase());
      const matchesCategory = category.length === 0 || category.includes(product.category);
      const matchesStatus = status.length === 0 || status.includes(product.isActive.toString());
      
      return matchesName && matchesCategory && matchesStatus;
    });
  }, [data, name, category, status]);

  const columns = useMemo<ColumnDef<Product>[]>(() => [
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
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage src={product.imageUrl} alt={product.title} />
              <AvatarFallback className="rounded-lg bg-[#2f2f2f] text-white">
                <Package className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-white">{product.title}</div>
              <div className="text-sm text-gray-400">{product.id}</div>
            </div>
          </div>
        );
      },
      meta: {
        variant: 'text',
        label: 'Product Name',
        placeholder: 'Search products...'
      }
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ getValue }) => {
        const category = getValue() as string;
        const categoryLabels: Record<string, string> = {
          graphics: 'Graphics',
          templates: 'Templates',
          icons: 'Icons',
          fonts: 'Fonts',
          backgrounds: 'Backgrounds'
        };
        return (
          <span className="text-gray-300">{categoryLabels[category] || category}</span>
        );
      },
      meta: {
        variant: 'multiSelect',
        label: 'Category',
        placeholder: 'Select categories...',
        options: [
          { label: 'Graphics', value: 'graphics' },
          { label: 'Templates', value: 'templates' },
          { label: 'Icons', value: 'icons' },
          { label: 'Fonts', value: 'fonts' },
          { label: 'Backgrounds', value: 'backgrounds' }
        ]
      }
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ getValue }) => (
        <span className="text-white font-medium">${parseFloat(getValue() as string).toFixed(2)}</span>
      ),
      meta: {
        variant: 'range',
        label: 'Price Range',
        placeholder: 'Enter price range...'
      }
    },
    {
      accessorKey: 'downloadCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Downloads" />
      ),
      cell: ({ getValue }) => (
        <span className="text-gray-300">{getValue() as number}</span>
      ),
      meta: {
        variant: 'range',
        label: 'Download Range',
        placeholder: 'Enter download range...'
      }
    },
    {
      accessorKey: 'tags',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tags" />
      ),
      cell: ({ getValue }) => {
        const tags = getValue() as string[] || [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
      meta: {
        variant: 'text',
        label: 'Tags',
        placeholder: 'Search tags...'
      }
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ getValue }) => {
        const isActive = getValue() as boolean;
        
        return (
          <Badge className={`${isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'} border`}>
            {isActive && <CheckCircle className="mr-1 h-3 w-3" />}
            {!isActive && <XCircle className="mr-1 h-3 w-3" />}
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
      meta: {
        variant: 'multiSelect',
        label: 'Status',
        placeholder: 'Select status...',
        options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' }
        ]
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const product = row.original;
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
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#2f2f2f]">
                <Star className="mr-2 h-4 w-4" />
                Toggle Featured
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#2f2f2f]">
                <Download className="mr-2 h-4 w-4" />
                Download
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
            <h1 className="text-3xl font-bold text-white">Products</h1>
            <p className="text-gray-400 mt-1">Manage your digital products and inventory</p>
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
          columnCount={8}
          rowCount={10}
          filterCount={3}
          cellWidths={["3rem", "15rem", "8rem", "6rem", "5rem", "12rem", "6rem", "4rem"]}
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
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage your digital products and inventory</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Products</CardTitle>
            <Package className="h-4 w-4 text-[#00ff99]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.length}</div>
            <p className="text-xs text-gray-500">Total in catalog</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Products</CardTitle>
            <Package className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.filter(p => p.isActive).length}
            </div>
            <p className="text-xs text-gray-500">Currently available</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Downloads</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.reduce((sum, p) => sum + (p.downloadCount || 0), 0)}
            </div>
            <p className="text-xs text-gray-500">All time downloads</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Price</CardTitle>
            <Package className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${data.length > 0 ? (data.reduce((sum, p) => sum + parseFloat(p.price), 0) / data.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-gray-500">Average product price</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Products</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your digital products and inventory.
              </CardDescription>
            </div>
            <Button className="bg-[#00ff99] text-black hover:bg-[#00ff99]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DataTableToolbar table={table} />
            <DataTable table={table} />
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Bar */}
      <FloatingActionBar
        table={table}
        onExport={() => {
          console.log('Exporting products...');
          // TODO: Implement export functionality
        }}
        onBulkDelete={(selectedIds) => {
          console.log('Bulk deleting products:', selectedIds);
          // TODO: Implement bulk delete functionality
        }}
        onBulkEdit={(selectedIds) => {
          console.log('Bulk editing products:', selectedIds);
          // TODO: Implement bulk edit functionality
        }}
        onBulkArchive={(selectedIds) => {
          console.log('Bulk archiving products:', selectedIds);
          // TODO: Implement bulk archive functionality
        }}
        exportLabel="Export Products"
      />
    </div>
  );
};

export default ProductsPage;