"use client"

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  visitors: number;
}

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ChartData[]>([]);
  const [trafficSources, setTrafficSources] = useState<ChartData[]>([]);

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    // Load analytics data immediately
    setMetrics([
      { label: 'Total Revenue', value: 45231, change: 12.5, trend: 'up' },
      { label: 'Total Orders', value: 1234, change: -2.3, trend: 'down' },
      { label: 'Total Customers', value: 8945, change: 8.7, trend: 'up' },
      { label: 'Conversion Rate', value: 3.2, change: 0.8, trend: 'up' }
    ]);

    setSalesData([
      { date: '2024-01-15', sales: 4200, orders: 45, visitors: 1200 },
      { date: '2024-01-16', sales: 3800, orders: 38, visitors: 1100 },
      { date: '2024-01-17', sales: 5200, orders: 52, visitors: 1400 },
      { date: '2024-01-18', sales: 4600, orders: 41, visitors: 1250 },
      { date: '2024-01-19', sales: 6100, orders: 58, visitors: 1600 },
      { date: '2024-01-20', sales: 5800, orders: 55, visitors: 1550 },
      { date: '2024-01-21', sales: 7200, orders: 67, visitors: 1800 }
    ]);

    setTopProducts([
      { name: 'Premium Logo Pack', value: 1250, color: '#00ff99' },
      { name: 'Business Card Templates', value: 980, color: '#0099ff' },
      { name: 'Social Media Kit', value: 750, color: '#ff6b6b' },
      { name: 'Website Templates', value: 620, color: '#ffd93d' },
      { name: 'Icon Collection', value: 450, color: '#6bcf7f' }
    ]);

    setTrafficSources([
      { name: 'Direct', value: 45, color: '#00ff99' },
      { name: 'Google Search', value: 30, color: '#0099ff' },
      { name: 'Social Media', value: 15, color: '#ff6b6b' },
      { name: 'Email', value: 7, color: '#ffd93d' },
      { name: 'Referral', value: 3, color: '#6bcf7f' }
    ]);

    setLoading(false);
  }, [timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getChangeColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header - Static, always visible */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Track your business performance and insights</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 bg-[#1a1a1a] border-[#2f2f2f] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value} className="text-white hover:bg-[#2f2f2f]">
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Metrics Cards Skeleton - Dynamic content only */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-[#1f1f1f] border-[#2f2f2f]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton - Dynamic content only */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48 bg-[#1a1a1a] border-[#2f2f2f] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2f2f2f]">
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value} className="text-white hover:bg-[#2f2f2f]">
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-[#2f2f2f] text-gray-400 hover:text-white">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const icons = [DollarSign, ShoppingCart, Users, Activity];
          const Icon = icons[index];
          const colors = ['#00ff99', '#0099ff', '#ff6b6b', '#ffd93d'];
          const color = colors[index];

          return (
            <Card key={metric.label} className="bg-[#1a1a1a] border-[#2f2f2f]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{metric.label}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <h3 className="text-2xl font-bold text-white">
                        {metric.label.includes('Revenue') ? formatCurrency(metric.value) :
                         metric.label.includes('Rate') ? formatPercentage(metric.value) :
                         formatNumber(metric.value)}
                      </h3>
                      <div className={`flex items-center gap-1 ${getChangeColor(metric.trend)}`}>
                        {getChangeIcon(metric.trend)}
                        <span className="text-sm font-medium">
                          {Math.abs(metric.change)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Daily sales performance for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((day, index) => {
                const maxSales = Math.max(...salesData.map(d => d.sales));
                const percentage = (day.sales / maxSales) * 100;
                
                return (
                  <div key={day.date} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-white">{formatCurrency(day.sales)}</span>
                        <span className="text-gray-400">{day.orders} orders</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Products
            </CardTitle>
            <CardDescription className="text-gray-400">
              Best performing products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const maxValue = Math.max(...topProducts.map(p => p.value));
                const percentage = (product.value / maxValue) * 100;
                
                return (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: product.color }}
                        />
                        <span className="text-white text-sm font-medium">{product.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{formatCurrency(product.value)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Traffic Sources
            </CardTitle>
            <CardDescription className="text-gray-400">
              Where your visitors come from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-white text-sm">{source.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Latest customer actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                <div>
                  <p className="text-white text-sm">New order #1234</p>
                  <p className="text-gray-400 text-xs">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                <div>
                  <p className="text-white text-sm">User registered</p>
                  <p className="text-gray-400 text-xs">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
                <div>
                  <p className="text-white text-sm">Product viewed</p>
                  <p className="text-gray-400 text-xs">8 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                <div>
                  <p className="text-white text-sm">Review submitted</p>
                  <p className="text-gray-400 text-xs">12 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2"></div>
                <div>
                  <p className="text-white text-sm">Payment failed</p>
                  <p className="text-gray-400 text-xs">15 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription className="text-gray-400">
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Avg. Order Value</span>
                <span className="text-white font-medium">$67.50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Cart Abandonment</span>
                <span className="text-white font-medium">23.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Return Rate</span>
                <span className="text-white font-medium">2.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Customer Lifetime Value</span>
                <span className="text-white font-medium">$245.80</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Page Views</span>
                <span className="text-white font-medium">12,456</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="bg-[#1a1a1a] border-[#2f2f2f]">
        <CardHeader>
          <CardTitle className="text-white">Performance Summary</CardTitle>
          <CardDescription className="text-gray-400">
            Overall business performance for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">Revenue Growth</span>
              </div>
              <p className="text-2xl font-bold text-green-400">+12.5%</p>
              <p className="text-gray-400 text-sm">Compared to previous period</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">Customer Acquisition</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">+8.7%</p>
              <p className="text-gray-400 text-sm">New customers this period</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-400" />
                <span className="text-white font-medium">Engagement Rate</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">+5.2%</p>
              <p className="text-gray-400 text-sm">User engagement improvement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;