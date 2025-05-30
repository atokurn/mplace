import { NextRequest, NextResponse } from 'next/server';

// Mock analytics data - in a real app, this would come from a database
const mockAnalytics = {
  overview: {
    totalRevenue: 125430,
    totalUsers: 2847,
    totalSales: 1523,
    totalDownloads: 8945,
    revenueGrowth: 12.5,
    usersGrowth: 8.3,
    salesGrowth: 15.2,
    downloadsGrowth: 22.1
  },
  recentSales: [
    {
      id: 1,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      productTitle: 'Vibrant background',
      amount: 12,
      date: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      productTitle: 'Man with leaves',
      amount: 38,
      date: '2024-01-20T09:15:00Z'
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      productTitle: '3D spheres',
      amount: 15,
      date: '2024-01-20T08:45:00Z'
    },
    {
      id: 4,
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah@example.com',
      productTitle: 'Grunge texture',
      amount: 55,
      date: '2024-01-19T16:20:00Z'
    },
    {
      id: 5,
      customerName: 'David Brown',
      customerEmail: 'david@example.com',
      productTitle: 'Geometric patterns',
      amount: 25,
      date: '2024-01-19T14:10:00Z'
    }
  ],
  topProducts: [
    {
      id: 1,
      title: 'Vibrant background',
      sales: 245,
      revenue: 2940,
      category: 'background'
    },
    {
      id: 2,
      title: 'Man with leaves',
      sales: 189,
      revenue: 7182,
      category: 'illustration'
    },
    {
      id: 3,
      title: '3D spheres',
      sales: 156,
      revenue: 2340,
      category: '3d'
    },
    {
      id: 4,
      title: 'Grunge texture',
      sales: 134,
      revenue: 7370,
      category: 'texture'
    },
    {
      id: 5,
      title: 'Geometric patterns',
      sales: 123,
      revenue: 3075,
      category: 'pattern'
    }
  ],
  categoryDistribution: [
    { category: 'Background', count: 45, percentage: 25.7 },
    { category: 'Illustration', count: 38, percentage: 21.7 },
    { category: '3D Assets', count: 32, percentage: 18.3 },
    { category: 'Texture', count: 28, percentage: 16.0 },
    { category: 'Pattern', count: 22, percentage: 12.6 },
    { category: 'Other', count: 10, percentage: 5.7 }
  ],
  revenueChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [8500, 9200, 8800, 10500, 11200, 9800, 12400, 13100, 11800, 14200, 15600, 12543]
  },
  userGrowth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [120, 145, 168, 192, 215, 238, 265, 289, 312, 341, 368, 284]
  },
  salesByCategory: {
    labels: ['Background', 'Illustration', '3D Assets', 'Texture', 'Pattern', 'Other'],
    data: [245, 189, 156, 134, 123, 67]
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const metric = searchParams.get('metric') || 'all'; // revenue, users, sales, downloads, all

    // In a real app, you would filter data based on period and metric
    let responseData = { ...mockAnalytics };

    // Simulate different data based on period
    if (period === '7d') {
      responseData.overview = {
        ...responseData.overview,
        totalRevenue: Math.floor(responseData.overview.totalRevenue * 0.2),
        totalUsers: Math.floor(responseData.overview.totalUsers * 0.1),
        totalSales: Math.floor(responseData.overview.totalSales * 0.15),
        totalDownloads: Math.floor(responseData.overview.totalDownloads * 0.12)
      };
    } else if (period === '90d') {
      responseData.overview = {
        ...responseData.overview,
        totalRevenue: Math.floor(responseData.overview.totalRevenue * 2.5),
        totalUsers: Math.floor(responseData.overview.totalUsers * 1.8),
        totalSales: Math.floor(responseData.overview.totalSales * 2.2),
        totalDownloads: Math.floor(responseData.overview.totalDownloads * 2.1)
      };
    } else if (period === '1y') {
      responseData.overview = {
        ...responseData.overview,
        totalRevenue: Math.floor(responseData.overview.totalRevenue * 8),
        totalUsers: Math.floor(responseData.overview.totalUsers * 6),
        totalSales: Math.floor(responseData.overview.totalSales * 7),
        totalDownloads: Math.floor(responseData.overview.totalDownloads * 7.5)
      };
    }

    // Filter by specific metric if requested
    if (metric !== 'all') {
      const filteredData: any = {
        overview: responseData.overview
      };

      switch (metric) {
        case 'revenue':
          filteredData.revenueChart = responseData.revenueChart;
          filteredData.topProducts = responseData.topProducts;
          break;
        case 'users':
          filteredData.userGrowth = responseData.userGrowth;
          break;
        case 'sales':
          filteredData.recentSales = responseData.recentSales;
          filteredData.salesByCategory = responseData.salesByCategory;
          break;
        case 'downloads':
          filteredData.topProducts = responseData.topProducts;
          filteredData.categoryDistribution = responseData.categoryDistribution;
          break;
      }

      responseData = filteredData;
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      period,
      metric,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// POST endpoint for updating analytics (for real-time updates)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // In a real app, you would process the event and update analytics
    switch (event) {
      case 'sale':
        // Update sales analytics
        console.log('Processing sale event:', data);
        break;
      case 'download':
        // Update download analytics
        console.log('Processing download event:', data);
        break;
      case 'user_signup':
        // Update user analytics
        console.log('Processing user signup event:', data);
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown event type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Analytics event processed successfully'
    });
  } catch (error) {
    console.error('Error processing analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    );
  }
}