"use client"

import { useMemo, useState, useEffect } from 'react';
import {
  Tag,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Percent,
  DollarSign,
  Users,
  Copy,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
  Clock,
  Plus
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { FloatingActionBar } from '@/components/data-table/floating-action-bar';
import { useDataTable } from '@/hooks/use-data-table';
import { useQueryState, parseAsString, parseAsArrayOf } from 'nuqs';
interface Promotion {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  minimumAmount?: number;
  description?: string;
  createdAt: string;
}

const PromotionsPage = () => {
  const [name] = useQueryState('name', parseAsString.withDefault(''));
  const [type] = useQueryState('type', parseAsArrayOf(parseAsString).withDefault([]));
  const [status] = useQueryState('status', parseAsArrayOf(parseAsString).withDefault([]));
  const [data, setData] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/promotions');
        if (!response.ok) {
          throw new Error('Failed to fetch promotions');
        }
        const promotions = await response.json();
        setData(promotions);
        setError(null);
      } catch (err) {
        console.error('Error loading promotions:', err);
        setError('Failed to load promotions');
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  const mockData: Promotion[] = [
    {
      id: 'PROMO-001',
      name: 'Summer Sale',
      code: 'SUMMER2024',
      type: 'percentage',
      value: '25',
      isActive: true,
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-02-15T23:59:59Z',
      usageLimit: 1000,
      usageCount: 245,
      minimumAmount: 50,
      description: '25% off on all summer items',
      createdAt: '2024-01-10T10:30:00Z'
    },
    {
      id: 'PROMO-002',
      name: 'New Customer Discount',
      code: 'WELCOME10',
      type: 'fixed_amount',
      value: '10',
      isActive: true,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      usageLimit: 500,
      usageCount: 89,
      minimumAmount: 30,
      description: '$10 off for new customers',
      createdAt: '2024-01-01T08:00:00Z'
    },
    {
      id: 'PROMO-003',
      name: 'Free Shipping Weekend',
      code: 'FREESHIP',
      type: 'free_shipping',
      value: '0',
      isActive: false,
      startDate: '2024-01-20T00:00:00Z',
      endDate: '2024-01-22T23:59:59Z',
      usageLimit: 200,
      usageCount: 156,
      minimumAmount: 25,
      description: 'Free shipping on orders over $25',
      createdAt: '2024-01-18T14:20:00Z'
    },
    {
      id: 'PROMO-004',
      name: 'Black Friday Mega Sale',
      code: 'BLACKFRIDAY50',
      type: 'percentage',
      value: '50',
      isActive: false,
      startDate: '2023-11-24T00:00:00Z',
      endDate: '2023-11-26T23:59:59Z',
      usageLimit: 2000,
      usageCount: 1847,
      minimumAmount: 100,
      description: '50% off everything - Black Friday special',
      createdAt: '2023-11-20T09:15:00Z'
    },
    {
      id: 'PROMO-005',
      name: 'Student Discount',
      code: 'STUDENT15',
      type: 'percentage',
      value: '15',
      isActive: true,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      usageLimit: 1500,
      usageCount: 423,
      description: '15% off for students',
      createdAt: '2024-01-01T12:00:00Z'
    },
    {
      id: 'PROMO-006',
      name: 'Flash Sale',
      code: 'FLASH30',
      type: 'percentage',
      value: '30',
      isActive: false,
      startDate: '2024-01-25T12:00:00Z',
      endDate: '2024-01-25T18:00:00Z',
      usageLimit: 100,
      usageCount: 78,
      minimumAmount: 40,
      description: '6-hour flash sale - 30% off',
      createdAt: '2024-01-25T10:00:00Z'
    }
  ];

  // Use mock data if API fails
  const displayData = data.length > 0 ? data : mockData;

  const filteredData = useMemo(() => {
    return displayData.filter(promotion => {
      const matchesName = name === '' || promotion.name.toLowerCase().includes(name.toLowerCase()) || promotion.code.toLowerCase().includes(name.toLowerCase());
      const matchesType = type.length === 0 || type.includes(promotion.type);
      const matchesStatus = status.length === 0 || status.includes(promotion.isActive ? 'active' : 'inactive');
      
      return matchesName && matchesType && matchesStatus;
    });
  }, [displayData, name, type, status]);

  const columns = useMemo<ColumnDef<Promotion>[]>(() => [
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
        <DataTableColumnHeader column={column} title="Promotion" />
      ),
      cell: ({ row }) => {
        const promo = row.original;
        return (
          <div>
            <div className="font-medium text-white">{promo.name}</div>
            <div className="text-sm text-gray-400">{promo.description}</div>
            {promo.minimumAmount && (
              <div className="text-xs text-gray-500">Min. order: ${promo.minimumAmount}</div>
            )}
          </div>
        );
      },
      meta: {
        variant: 'text',
        label: 'Search promotions...',
        placeholder: 'Search by name or description...'
      },
    },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <code className="bg-[#2f2f2f] text-[#00ff99] px-2 py-1 rounded text-sm font-mono">
            {getValue() as string}
          </code>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            onClick={() => navigator.clipboard.writeText(getValue() as string)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
      meta: {
        variant: 'text',
        label: 'Search codes...',
        placeholder: 'Search by promotion code...'
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ getValue }) => {
        const type = getValue() as string;
        const getTypeIcon = (type: string) => {
          switch (type) {
            case 'percentage':
              return <Percent className="h-4 w-4" />;
            case 'fixed_amount':
              return <DollarSign className="h-4 w-4" />;
            case 'free_shipping':
              return <Tag className="h-4 w-4" />;
            default:
              return <Tag className="h-4 w-4" />;
          }
        };
        const getTypeBadge = (type: string) => {
          switch (type) {
            case 'percentage':
              return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Percentage</Badge>;
            case 'fixed_amount':
              return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Fixed Amount</Badge>;
            case 'free_shipping':
              return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Free Shipping</Badge>;
            default:
              return <Badge variant="outline">{type}</Badge>;
          }
        };
        return (
          <div className="flex items-center gap-2">
            {getTypeIcon(type)}
            {getTypeBadge(type)}
          </div>
        );
      },
      meta: {
        variant: 'multiSelect',
        label: 'Type',
        options: [
          { label: 'Percentage', value: 'percentage' },
          { label: 'Fixed Amount', value: 'fixed_amount' },
          { label: 'Free Shipping', value: 'free_shipping' },
        ],
      },
    },
    {
      accessorKey: 'value',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Value" />
      ),
      cell: ({ getValue, row }) => {
        const value = getValue() as string;
        const type = row.original.type;
        const numValue = parseFloat(value);
        const formatValue = (type: string, value: number) => {
          switch (type) {
            case 'percentage':
              return `${value}%`;
            case 'fixed_amount':
              return `$${value.toFixed(2)}`;
            case 'free_shipping':
              return 'Free';
            default:
              return value.toString();
          }
        };
        return (
          <span className="text-white font-medium">
            {formatValue(type, numValue)}
          </span>
        );
      },
      meta: {
        variant: 'range',
        label: 'Value Range',
      },
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ getValue, row }) => {
        const isActive = getValue() as boolean;
        const promotion = row.original;
        
        // Check if promotion is expired
        const isExpired = promotion.endDate && new Date(promotion.endDate) < new Date();
        
        let status = 'inactive';
        let variant = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        
        if (isExpired) {
          status = 'expired';
          variant = 'bg-red-500/20 text-red-400 border-red-500/30';
        } else if (isActive) {
          status = 'active';
          variant = 'bg-green-500/20 text-green-400 border-green-500/30';
        }
        
        return (
          <Badge className={`${variant} border`}>
            {status === 'active' && <CheckCircle className="mr-1 h-3 w-3" />}
            {status === 'inactive' && <Clock className="mr-1 h-3 w-3" />}
            {status === 'expired' && <XCircle className="mr-1 h-3 w-3" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
      meta: {
        variant: 'multiSelect',
        label: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Expired', value: 'expired' },
        ],
      },
    },
    {
      accessorKey: 'usageCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Usage" />
      ),
      cell: ({ getValue, row }) => {
        const usageCount = getValue() as number;
        const usageLimit = row.original.usageLimit;
        const getUsagePercentage = (used: number, limit: number) => {
          return (used / limit) * 100;
        };
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">{usageCount}</span>
              <span className="text-gray-400">/ {usageLimit}</span>
            </div>
            <Progress 
              value={getUsagePercentage(usageCount, usageLimit)} 
              className="h-2"
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Valid Until" />
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1 text-gray-300">
          <Calendar className="h-3 w-3" />
          {new Date(getValue()).toLocaleDateString()}
        </div>
      ),
      meta: {
         variant: 'dateRange',
         label: 'End Date Range',
       },
     },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const promo = row.original;
        
        const copyCode = (code: string) => {
          navigator.clipboard.writeText(code);
        };
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2f2f2f]">
              <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2f2f2f]" />
              <DropdownMenuItem className="text-gray-400 hover:text-white hover:bg-[#2f2f2f]">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-400 hover:text-white hover:bg-[#2f2f2f]">
                <Edit className="mr-2 h-4 w-4" />
                Edit Promotion
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-400 hover:text-white hover:bg-[#2f2f2f]"
                onClick={() => copyCode(promo.code)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2f2f2f]" />
              <DropdownMenuItem className="text-gray-400 hover:text-white hover:bg-[#2f2f2f]">
                <ToggleLeft className="mr-2 h-4 w-4" />
                {promo.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2f2f2f]" />
              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-[#2f2f2f]">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Promotion
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
    pageCount: Math.ceil(filteredData.length / 10),
    searchableColumns: [
      {
        id: 'name',
        title: 'Name',
      },
    ],
    filterableColumns: [
      {
        id: 'type',
        title: 'Type',
        options: [
          { label: 'Percentage', value: 'percentage' },
          { label: 'Fixed Amount', value: 'fixed' },
          { label: 'Free Shipping', value: 'free_shipping' },
          { label: 'BOGO', value: 'bogo' },
        ],
      },
      {
        id: 'status',
        title: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Expired', value: 'expired' },
          { label: 'Scheduled', value: 'scheduled' },
        ],
      },
    ],
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Promotions</h1>
            <p className="text-gray-400 mt-1">Manage discount codes and promotional campaigns</p>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
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

        {/* Data Table Skeleton */}
        <DataTableSkeleton
          columnCount={9}
          rowCount={10}
          filterCount={3}
          cellWidths={["3rem", "12rem", "8rem", "6rem", "6rem", "6rem", "6rem", "8rem", "4rem"]}
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
          <h1 className="text-3xl font-bold text-white">Promotions</h1>
          <p className="text-gray-400 mt-1">Manage discount codes and promotional campaigns</p>
        </div>
        <Button className="bg-[#00ff99] text-black hover:bg-[#00ff99]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#00ff99]/10">
                <Tag className="h-6 w-6 text-[#00ff99]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{displayData.length}</h3>
                <p className="text-gray-400 text-sm">Total Promotions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <ToggleRight className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {displayData.filter(p => p.isActive && (!p.endDate || new Date(p.endDate) >= new Date())).length}
                </h3>
                <p className="text-gray-400 text-sm">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {displayData.reduce((sum, p) => sum + (p.usageCount || 0), 0)}
                </h3>
                <p className="text-gray-400 text-sm">Total Uses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <Calendar className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {displayData.filter(p => p.endDate && new Date(p.endDate) < new Date()).length}
                </h3>
                <p className="text-gray-400 text-sm">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Promotions Table */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Promotions</CardTitle>
              <CardDescription className="text-gray-400">
                Manage discount codes, promotional campaigns, and special offers.
              </CardDescription>
            </div>
            <Button className="bg-[#00ff99] text-black hover:bg-[#00ff99]/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Promotion
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
          console.log('Exporting promotions...');
          // TODO: Implement export functionality
        }}
        onBulkDelete={(selectedIds) => {
          console.log('Bulk deleting promotions:', selectedIds);
          // TODO: Implement bulk delete functionality
        }}
        onBulkEdit={(selectedIds) => {
          console.log('Bulk editing promotions:', selectedIds);
          // TODO: Implement bulk edit functionality
        }}
        exportLabel="Export Promotions"
      />
    </div>
  );
};

export default PromotionsPage;