"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "./Overview";
import { RecentSales } from "./RecentSales";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardAnalyticsData {
  totalRevenue: number;
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  overviewData: { name: string; total: number }[];
  recentSales: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    amount: number;
  }[];
}

interface DashboardOverviewProps {
  initialData: DashboardAnalyticsData | null;
}

export function DashboardOverview({ initialData }: DashboardOverviewProps) {
  const [data, setData] = React.useState<DashboardAnalyticsData | null>(initialData);
  const [loading, setLoading] = React.useState(!initialData);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      setError(null);
    } else {
      setLoading(false);
      // Set an error message or handle the null initialData case appropriately
      // This could be because the server-side fetch failed or returned no data
      setError("Dashboard data is currently unavailable."); 
    }
  }, [initialData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-1" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="pl-2">
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-1"/>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-1/4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <p className="text-red-500">{error}</p>
  //     </div>
  //   );
  // }

  // if (!data) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <p>No data available.</p>
  //     </div>
  //   );
  // }

  // Enhanced error and no-data handling directly before trying to access data properties
  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className={error ? "text-red-500" : ""}>
          {error || "No data available."}
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "", // You might want to calculate percentage change here if needed
      icon: DollarSign,
    },
    {
      title: "Products",
      value: data.totalProducts.toLocaleString(),
      description: "",
      icon: Package,
    },
    {
      title: "Orders",
      value: data.totalOrders.toLocaleString(),
      description: "",
      icon: ShoppingCart,
    },
    {
      title: "Active Users",
      value: data.totalUsers.toLocaleString(),
      description: "",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.description && (
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={data.overviewData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              Displaying the latest {data.recentSales.length} sales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales data={data.recentSales} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}