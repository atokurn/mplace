import { NextRequest, NextResponse } from 'next/server';

// Mock contact data
const mockContactInfo = {
  email: 'hello@pixel.com',
  phone: '+1 (555) 123-4567',
  address: '123 Digital Street, Tech City, TC 12345',
  socialMedia: {
    twitter: 'https://twitter.com/pixel',
    instagram: 'https://instagram.com/pixel',
    linkedin: 'https://linkedin.com/company/pixel',
    facebook: 'https://facebook.com/pixel'
  },
  businessHours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '10:00 AM - 4:00 PM',
    sunday: 'Closed'
  }
};

const mockMessages: Array<{
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}> = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about licensing',
    message: 'I have a question about commercial licensing for digital assets.',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'replied'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Partnership inquiry',
    message: 'We would like to discuss a potential partnership opportunity.',
    createdAt: '2024-01-14T14:20:00Z',
    status: 'read'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'info') {
      return NextResponse.json({
        success: true,
        data: mockContactInfo
      });
    }

    if (type === 'messages') {
      const status = searchParams.get('status');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      
      let filteredMessages = mockMessages;
      
      if (status && status !== 'all') {
        filteredMessages = mockMessages.filter(msg => msg.status === status);
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMessages = filteredMessages.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: {
          messages: paginatedMessages,
          pagination: {
            page,
            limit,
            total: filteredMessages.length,
            totalPages: Math.ceil(filteredMessages.length / limit)
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: mockContactInfo
    });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create new message
    const newMessage = {
      id: mockMessages.length + 1,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: 'new' as const
    };

    // In a real app, this would save to database
    mockMessages.unshift(newMessage);

    // Simulate email notification (in real app, use email service)
    console.log('New contact message received:', newMessage);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: newMessage.id,
        createdAt: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}