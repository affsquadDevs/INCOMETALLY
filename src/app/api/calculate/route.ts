import { NextRequest, NextResponse } from 'next/server';
import { computeNet, annualizeIncome } from '@/lib/tax/calc';
import { getTaxTable } from '@/lib/tax';
import { type IncomeMode } from '@/lib/tax/types';

/**
 * Server-side calculation endpoint for progressive enhancement
 * Allows calculator to work without JavaScript
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      countryCode,
      year,
      mode,
      value,
      hoursPerWeek = 40,
      weeksPerYear = 52,
    } = body;

    // Validate inputs
    const normalizedCountryCode = countryCode ? (countryCode as string).toUpperCase() : null;
    if (!normalizedCountryCode || !year || !mode || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Germany needs extra parameters (tax class, state, church, insurance).
    // If the request doesn't send them, we can't calculate correctly.
    if (normalizedCountryCode === 'DE') {
      return NextResponse.json(
        { error: 'Germany calculator requires JavaScript (extra tax options needed).' },
        { status: 400 }
      );
    }

    const income = parseFloat(value);
    const hours = parseFloat(hoursPerWeek) || 40;
    const weeks = parseFloat(weeksPerYear) || 52;

    if (isNaN(income) || income < 0) {
      return NextResponse.json(
        { error: 'Invalid income value' },
        { status: 400 }
      );
    }

    // Get tax table
    const taxTable = getTaxTable(normalizedCountryCode, year);

    // Calculate annual gross
    const annualGross = annualizeIncome(mode as IncomeMode, income, hours, weeks);

    // Calculate net income
    const result = computeNet(annualGross, taxTable, hours, weeks);

    return NextResponse.json({
      success: true,
      result,
      taxTable: {
        metadata: taxTable.metadata,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Calculation failed',
      },
      { status: 500 }
    );
  }
}

