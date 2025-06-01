import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  generateUploadUrl, 
  generateFileKey, 
  validateFileType, 
  ALLOWED_DESIGN_TYPES,
  ALLOWED_IMAGE_TYPES 
} from '@/lib/storage';

// POST /api/upload - Generate presigned URL for file upload
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileName, fileType, uploadType } = body;
    
    if (!fileName || !fileType || !uploadType) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileType, uploadType' },
        { status: 400 }
      );
    }

    // Validate file type based on upload type
    let allowedTypes: string[];
    
    switch (uploadType) {
      case 'image':
        allowedTypes = ALLOWED_IMAGE_TYPES;
        break;
      case 'product':
        allowedTypes = ALLOWED_DESIGN_TYPES;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid upload type. Must be "image" or "product"' },
          { status: 400 }
        );
    }

    if (!validateFileType(fileType, allowedTypes)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate unique file key
    const fileKey = generateFileKey(fileName, session.user.id);
    
    // Generate presigned URL
    const uploadUrl = await generateUploadUrl(fileKey, fileType);
    
    return NextResponse.json({
      uploadUrl,
      fileKey,
      message: 'Upload URL generated successfully'
    });
  } catch (error) {
    console.error('Upload URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}