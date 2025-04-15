import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
      // Check content type
      const contentType = request.headers.get('content-type');
      if (!contentType?.includes('multipart/form-data')) {
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
      }
  
      const formData = await request.formData();
      const file = formData.get('file') as File;
  
      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }
  
      // Upload to Cloudinary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'farmconnect' },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        ).end(buffer);
      });
  
      return NextResponse.json(result);
    } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }
  }