import { NextRequest, NextResponse } from 'next/server';

// Mock user data - in a real app, this would come from a database
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    avatar: '/placeholder.svg',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20',
    totalPurchases: 15,
    totalSpent: 450
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    avatar: '/placeholder.svg',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19',
    totalPurchases: 8,
    totalSpent: 220
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    status: 'inactive',
    avatar: '/placeholder.svg',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-15',
    totalPurchases: 3,
    totalSpent: 85
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'moderator',
    status: 'active',
    avatar: '/placeholder.svg',
    joinDate: '2024-01-08',
    lastLogin: '2024-01-20',
    totalPurchases: 12,
    totalSpent: 380
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'user',
    status: 'suspended',
    avatar: '/placeholder.svg',
    joinDate: '2024-01-12',
    lastLogin: '2024-01-18',
    totalPurchases: 2,
    totalSpent: 45
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Filter users
    let filteredUsers = mockUsers.filter(user => {
      const matchesSearch = search === '' || 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesRole = role === 'all' || user.role === role;
      const matchesStatus = status === 'all' || user.status === status;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filteredUsers.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        case 'totalSpent':
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        roles: ['admin', 'moderator', 'user'],
        statuses: ['active', 'inactive', 'suspended']
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role = 'user', status = 'active' } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      name,
      email,
      role,
      status,
      avatar: '/placeholder.svg',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
      totalPurchases: 0,
      totalSpent: 0
    };

    mockUsers.push(newUser);

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}