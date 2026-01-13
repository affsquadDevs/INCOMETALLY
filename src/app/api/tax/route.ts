import { NextRequest, NextResponse } from 'next/server';
import { getTaxTable } from '@/lib/tax';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countryCode = searchParams.get('countryCode');
  const year = searchParams.get('year');

  if (!countryCode || !year) {
    return NextResponse.json(
      { error: 'Missing countryCode or year parameter' },
      { status: 400 }
    );
  }

  try {
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum)) {
      return NextResponse.json(
        { error: 'Invalid year parameter' },
        { status: 400 }
      );
    }

    const taxTable = getTaxTable(countryCode, yearNum);
    return NextResponse.json(taxTable);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load tax data' },
      { status: 500 }
    );
  }
}

