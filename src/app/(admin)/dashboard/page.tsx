"use client"

import { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Plus
} from 'lucide-react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

interface RecentDownload {
  id: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  productPrice: string;
  downloadedAt: string;
}

interface TopProduct {
  id: string;
  title: string;
  downloadCount: number;
  price: string;
  revenue: number;
  category: string;
}

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalDownloads: number;
  totalRevenue: number;
  monthlyGrowth: number;
  conversionRate: number;
  averageRating: number;
}

const columnHelper = createColumnHelper<RecentDownload>();

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
    averageRating: 0
  });

  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        
        setStats({
          totalProducts: data.totalProducts || 0,
          totalUsers: data.totalUsers || 0,
          totalDownloads: data.totalDownloads || 0,
          totalRevenue: data.totalRevenue || 0,
          monthlyGrowth: data.monthlyGrowth || 0,
          conversionRate: data.conversionRate || 0,
          averageRating: data.averageRating || 0
        });
        
        setRecentDownloads(data.recentDownloads || []);
        setTopProducts(data.topProducts || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = useMemo(() => [
    columnHelper.accessor('customerName', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
      cell: ({ getValue, row }) => (
        <div>
          <span className="text-white font-medium">{getValue()}</span>
          <br />
          <span className="text-gray-400 text-sm">{row.original.customerEmail}</span>
        </div>
      ),
    }),
    columnHelper.accessor('productTitle', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      cell: ({ getValue }) => (
        <span className="text-gray-300">{getValue()}</span>
      ),
    }),
    columnHelper.accessor('productPrice', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ getValue }) => (
        <span className="text-white">${getValue()}</span>
      ),
    }),
    columnHelper.accessor('downloadedAt', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Downloaded" />
      ),
      cell: ({ getValue }) => (
        <span className="text-gray-400">{formatDate(getValue())}</span>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: recentDownloads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#2f2f2f] text-gray-400 hover:text-white">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-[#00ff99] text-black hover:bg-[#00cc7a]">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Products</CardTitle>
            <Package className="h-4 w-4 text-[#00ff99]" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#00ff99]" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-blue-400 flex items-center">
                ★{stats.averageRating.toFixed(1)} avg rating
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-[#00ff99]" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-green-400 flex items-center">
                {stats.conversionRate}% conversion rate
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#00ff99]" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Downloads */}
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white">Recent Downloads</CardTitle>
            <CardDescription className="text-gray-400">
              Latest product downloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <DataTableSkeleton
                columnCount={4}
                rowCount={5}
                filterCount={0}
                cellWidths={["12rem", "8rem", "8rem", "8rem"]}
                withViewOptions={false}
                withPagination={false}
              />
            ) : recentDownloads.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No downloads found</div>
            ) : (
              <DataTable table={table} className="border-[#2f2f2f]" />
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white">Top Products</CardTitle>
            <CardDescription className="text-gray-400">
              Most downloaded products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f0f] border border-[#2f2f2f]">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-gray-400 text-center py-4">No products found</div>
              ) : (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f0f] border border-[#2f2f2f]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#00ff99] rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.title}</p>
                        <p className="text-gray-400 text-sm">{product.downloadCount} downloads</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${Number(product.revenue).toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">${product.price} each</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white">Conversion Rate</CardTitle>
            <CardDescription className="text-gray-400">
              Percentage of visitors who make a purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.conversionRate}%</span>
                <span className="text-green-400 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.3% from last month
                </span>
              </div>
              <Progress value={stats.conversionRate * 10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white">Monthly Growth</CardTitle>
            <CardDescription className="text-gray-400">
              User growth compared to previous month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.monthlyGrowth}%</span>
                <span className="text-green-400 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Excellent growth
                </span>
              </div>
              <Progress value={stats.monthlyGrowth * 4} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;