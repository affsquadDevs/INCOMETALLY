import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GermanyOptionsData } from '@/types/germany';

export async function GET() {
  try {
    const optionsPath = path.join(process.cwd(), 'src', 'data', 'tax', 'de', 'germany-options.json');
    const fileContent = fs.readFileSync(optionsPath, 'utf-8');
    const data: GermanyOptionsData = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load Germany options' },
      { status: 500 }
    );
  }
}

