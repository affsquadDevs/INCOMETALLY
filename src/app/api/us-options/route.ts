import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { USOptionsData } from '@/types/us';
import { validateUsOptionsData } from '@/lib/tax/us-schema';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year');
    const yearNum = year ? parseInt(year, 10) : NaN;

    // We currently ship a single options file; keep the API forward-compatible.
    const optionsPath = path.join(process.cwd(), 'src', 'data', 'tax', 'us', 'us-options.json');
    const fileContent = fs.readFileSync(optionsPath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    const validation = validateUsOptionsData(parsed);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid US options data', details: validation.errors },
        { status: 500 }
      );
    }
    const data: USOptionsData = validation.data as USOptionsData;

    if (!Number.isNaN(yearNum) && data.metadata.year !== yearNum) {
      // Soft mismatch: return the closest we have.
      return NextResponse.json({
        ...data,
        metadata: {
          ...data.metadata,
          notes: `${data.metadata.notes} (Requested year ${yearNum}, serving ${data.metadata.year} parameters.)`,
        },
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to load US options' }, { status: 500 });
  }
}
