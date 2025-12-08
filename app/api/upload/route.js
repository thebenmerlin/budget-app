import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const file = await request.blob();

    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`;

    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (!data.secure_url) {
      return NextResponse.json(
        { error: 'Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.secure_url }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}