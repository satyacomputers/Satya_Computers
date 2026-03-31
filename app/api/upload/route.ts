import { NextResponse } from 'next/server';
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

    // Convert image to Base64 for direct Database Storage (Turso)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    return NextResponse.json({ 
      success: true, 
      url: base64Image,
      name: file.name,
      isEmbedded: true,
      notice: "Asset converted to Base64 for Database Injection."
    });
  } catch (error: any) {
    console.error('Core Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error during transport' }, { status: 500 });
  }
}
