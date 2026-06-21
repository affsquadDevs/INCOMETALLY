import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

/**
 * API endpoint to fetch Poland tax options data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || '2026', 10);

    const filePath = path.join(process.cwd(), 'src', 'data', 'tax', 'pl', 'pl-options.json');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Poland options file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (data.metadata.year !== year) {
      return NextResponse.json(
        { error: `Year mismatch: file contains ${data.metadata.year} but requested ${year}` },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading Poland options:', error);
    return NextResponse.json({ error: 'Failed to load Poland options' }, { status: 500 });
  }
}
