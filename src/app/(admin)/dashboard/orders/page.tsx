"use client"

import { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Package,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Plus
} from 'lucide-react';
import { parseAsString, parseAsArrayOf, useQueryState } from 'nuqs';

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
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { FloatingActionBar } from '@/components/data-table/floating-action-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataTable } from '@/hooks/use-data-table';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: string[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  itemCount?: number;
}

const OrdersPage = () => {
  const [customerName] = useQueryState('customerName', parseAsString.withDefault(''));
  const [status] = useQueryState('status', parseAsArrayOf(parseAsString).withDefault([]));
  const [paymentStatus] = useQueryState('paymentStatus', parseAsArrayOf(parseAsString).withDefault([]));
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const orders = await response.json();
        setData(orders);
        setError(null);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const mockData: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      products: ['Vibrant Background Pack', 'Modern UI Kit'],
      total: 79.98,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      products: ['3D Icon Collection'],
      total: 19.99,
      status: 'processing',
      paymentStatus: 'paid',
      createdAt: '2024-01-14T16:45:00Z'
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      products: ['Typography Bundle', 'Minimal Graphics Set'],
      total: 64.98,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2024-01-14T09:15:00Z'
    },
    {
      id: 'ORD-004',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah@example.com',
      products: ['Modern UI Kit', 'Typography Bundle'],
      total: 89.98,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: '2024-01-13T14:20:00Z'
    },
    {
      id: 'ORD-005',
      customerName: 'David Brown',
      customerEmail: 'david@example.com',
      products: ['Vibrant Background Pack'],
      total: 29.99,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2024-01-12T11:00:00Z'
    }
  ];

  // Use mock data if API fails
  const finalData = data.length > 0 ? data : mockData;

  const filteredData = useMemo(() => {
    return finalData.filter((order) => {
      const matchesCustomerName = customerName === '' || order.customerName.toLowerCase().includes(customerName.toLowerCase());
      const matchesStatus = status.length === 0 || status.includes(order.status);
      const matchesPaymentStatus = paymentStatus.length === 0 || paymentStatus.includes(order.paymentStatus);
      return matchesCustomerName && matchesStatus && matchesPaymentStatus;
    });
  }, [finalData, customerName, status, paymentStatus]);

  const columns: ColumnDef<Order>[] = [
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
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2f2f2f]">
              <Package className="h-5 w-5 text-[#00ff99]" />
            </div>
            <div>
              <div className="font-medium text-white">{order.id}</div>
              <div className="text-sm text-gray-400">{order.customerName}</div>
            </div>
          </div>
        );
      },
      meta: {
        label: 'Order ID',
        placeholder: 'Search order IDs...',
        variant: 'text'
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'customerEmail',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="text-white">{row.original.customerName}</div>
          <div className="text-sm text-gray-400">{row.getValue('customerEmail')}</div>
        </div>
      ),
      meta: {
        label: 'Customer',
        placeholder: 'Search customers...',
        variant: 'text'
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'products',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Products" />
      ),
      cell: ({ row }) => {
        const products = row.getValue('products') as string[];
        return (
          <Badge variant="secondary" className="bg-[#2f2f2f] text-white border-[#3f3f3f]">
            {products.length} items
          </Badge>
        );
      },
      meta: {
        label: 'Item Count',
        variant: 'range',
        placeholder: 'Enter item count range...'
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => {
        const total = row.getValue('total') as number;
        return (
          <span className="text-white font-medium">
            ${total.toFixed(2)}
          </span>
        );
      },
      meta: {
        label: 'Total Amount',
        variant: 'range',
        placeholder: 'Enter amount range...'
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variants = {
          pending: { icon: Clock, className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
          processing: { icon: Clock, className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
          shipped: { icon: Package, className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
          delivered: { icon: CheckCircle, className: 'bg-green-500/20 text-green-400 border-green-500/30' },
          cancelled: { icon: XCircle, className: 'bg-red-500/20 text-red-400 border-red-500/30' }
        };
        const variant = variants[status as keyof typeof variants];
        const Icon = variant.icon;
        return (
          <Badge className={`${variant.className} border flex items-center gap-1`}>
            <Icon className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        placeholder: 'Select status...',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Processing', value: 'processing' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' }
        ]
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'paymentStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment" />
      ),
      cell: ({ row }) => {
        const paymentStatus = row.getValue('paymentStatus') as string;
        const variants = {
          pending: { icon: Clock, className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
          paid: { icon: CheckCircle, className: 'bg-green-500/20 text-green-400 border-green-500/30' },
          failed: { icon: XCircle, className: 'bg-red-500/20 text-red-400 border-red-500/30' },
          refunded: { icon: XCircle, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
        };
        const variant = variants[paymentStatus as keyof typeof variants];
        const Icon = variant.icon;
        return (
          <Badge className={`${variant.className} border flex items-center gap-1`}>
            <Icon className="h-3 w-3" />
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string;
        return (
          <span className="text-gray-300">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        );
      },
      meta: {
        label: 'Order Date',
        variant: 'dateRange'
      },
      enableColumnFilter: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const order = row.original;
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
                Edit Order
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#2f2f2f]">
                <Clock className="mr-2 h-4 w-4" />
                Mark Processing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#2f2f2f]">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Completed
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
  ];

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: -1,
    searchableColumns: [
      {
        id: 'customerName',
        title: 'Customer Name',
      },
    ],
    filterableColumns: [
      {
        id: 'status',
        title: 'Status',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Processing', value: 'processing' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
        ],
      },
      {
        id: 'paymentStatus',
        title: 'Payment Status',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Paid', value: 'paid' },
          { label: 'Failed', value: 'failed' },
          { label: 'Refunded', value: 'refunded' },
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
            <h1 className="text-3xl font-bold text-white">Orders</h1>
            <p className="text-gray-400 mt-1">Track and manage customer orders</p>
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
          cellWidths={["3rem", "8rem", "15rem", "12rem", "8rem", "8rem", "10rem", "8rem", "4rem"]}
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
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-[#00ff99]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{finalData.length}</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {finalData.filter(order => order.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-500">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <Package className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${finalData.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">From all orders</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Order Value</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${finalData.length > 0 ? (finalData.reduce((sum, o) => sum + o.total, 0) / finalData.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-gray-500">Per order</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Orders</CardTitle>
              <CardDescription className="text-gray-400">
                Manage customer orders and fulfillment.
              </CardDescription>
            </div>
            <Button className="bg-[#00ff99] text-black hover:bg-[#00ff99]/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>

      {/* Orders Table */}
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
          console.log('Exporting orders...');
          // TODO: Implement export functionality
        }}
        onBulkDelete={(selectedIds) => {
          console.log('Bulk deleting orders:', selectedIds);
          // TODO: Implement bulk delete functionality
        }}
        onBulkEdit={(selectedIds) => {
          console.log('Bulk editing orders:', selectedIds);
          // TODO: Implement bulk edit functionality
        }}
        exportLabel="Export Orders"
      />
    </div>
  );
};

export default OrdersPage;