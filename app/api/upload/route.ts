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
    
    // Attempt save to Local Filesystem
    try {
      const uploadPath = path.join(process.cwd(), 'public', 'products', filename);
      
      // Ensure directory exists in dev but don't fail here if it's read-only
      const dir = path.dirname(uploadPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(uploadPath, buffer);

      return NextResponse.json({ 
        success: true, 
        url: `/products/${filename}`,
        fileName: filename,
        isEmbedded: false,
        notice: "Asset successfully deployed to server filesystem."
      });
    } catch (fsError: any) {
      console.warn('Filesystem Write Blocked (Likely Live/Serverless): Switching to Embedded Protocol', fsError.message);
      
      // Fallback Strategy: Professional Base64 Encoding
      const base64Data = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      const dataUri = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json({ 
        success: true, 
        url: dataUri,
        fileName: filename,
        isEmbedded: true,
        notice: "Detected serverless environment. Asset has been converted to an embedded Data URI for database synchronization."
      });
    }
  } catch (error: any) {
    console.error('Core Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error during transport' }, { status: 500 });
  }
}
