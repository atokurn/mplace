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
    totalSpent: 450,
    bio: 'Experienced digital artist and marketplace administrator.',
    location: 'New York, USA',
    website: 'https://johndoe.com'
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
    totalSpent: 220,
    bio: 'Graphic designer passionate about digital art.',
    location: 'London, UK',
    website: 'https://janesmith.design'
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
    totalSpent: 85,
    bio: 'Freelance photographer and content creator.',
    location: 'Toronto, Canada',
    website: ''
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
    totalSpent: 380,
    bio: 'Community moderator and digital asset curator.',
    location: 'Sydney, Australia',
    website: 'https://sarahwilson.art'
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
    totalSpent: 45,
    bio: 'Digital artist exploring new creative horizons.',
    location: 'Berlin, Germany',
    website: ''
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's purchase history (mock data)
    const purchaseHistory = [
      {
        id: 1,
        productId: 1,
        productTitle: 'Vibrant background',
        price: 12,
        purchaseDate: '2024-01-18',
        downloadCount: 3
      },
      {
        id: 2,
        productId: 3,
        productTitle: '3D spheres',
        price: 15,
        purchaseDate: '2024-01-16',
        downloadCount: 1
      }
    ];

    return NextResponse.json({
      user,
      purchaseHistory,
      stats: {
        totalDownloads: user.totalPurchases * 2,
        favoriteProducts: user.totalPurchases / 2,
        accountAge: Math.floor((new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, email, role, status, bio, location, website } = body;

    // Validate email uniqueness if changed
    if (email && email !== mockUsers[userIndex].email) {
      const existingUser = mockUsers.find(user => user.email === email && user.id !== userId);
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(status && { status }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(website !== undefined && { website })
    };

    mockUsers[userIndex] = updatedUser;

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove user from array
    const deletedUser = mockUsers.splice(userIndex, 1)[0];

    return NextResponse.json({
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}