import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from 'node:fs';
import path from 'node:path';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized Session: Login required for Asset Provisioning' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file detected in transmission' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create professional filename
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const filename = `manual_add_${timestamp}_${cleanFileName}`;
    
    // Save to Local Filesystem: public/products/
    const uploadPath = path.join(process.cwd(), 'public', 'products', filename);
    fs.writeFileSync(uploadPath, buffer);

    const relativeUrl = `/products/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: relativeUrl,
      fileName: filename,
      isEmbedded: false,
      notice: "Asset successfully deployed to server filesystem."
    });
  } catch (error: any) {
    console.error('Core Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error during transport' }, { status: 500 });
  }
}
