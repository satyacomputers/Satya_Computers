import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

    const name = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if directory exists
    }

    try {
        const filePath = join(uploadDir, name);
        await writeFile(filePath, buffer);
    } catch (fsError: any) {
        // HEAL PROTOCOL: Serverless Environment Detected (e.g. Netlify/Vercel)
        // Reverting to Base64 Embedded Asset Protocol to ensure persistence in Database
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
        
        return NextResponse.json({ 
          success: true, 
          url: base64,
          name: name,
          isEmbedded: true,
          notice: "Serverless disk rejection: Asset has been converted to an embedded Data URL for database persistence."
        });
    }

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${name}`,
      name: name
    });
  } catch (error: any) {
    console.error('Core Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error during transport' }, { status: 500 });
  }
}
