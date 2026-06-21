/**
 * Content pillars for the /guides library.
 * Each pillar has a cornerstone article; cluster articles link up to it.
 */

export interface Pillar {
  id: string;
  title: string;
  description: string;
  cornerstoneSlug: string;
}

export const pillars: Pillar[] = [
  {
    id: 'income-basics',
    title: 'Understanding Your Income',
    description:
      'Gross vs net pay, take-home pay, and how to convert income between hourly, monthly, and yearly figures.',
    cornerstoneSlug: 'gross-income-vs-net-income',
  },
  {
    id: 'income-tax',
    title: 'How Income Tax Works',
    description:
      'Tax brackets, deductions, social contributions, and how income tax shapes your take-home pay across countries.',
    cornerstoneSlug: 'how-income-tax-works',
  },
  {
    id: 'salary-career',
    title: 'Salary, Jobs & Money Planning',
    description:
      'Benchmark your pay, compare job offers, weigh cost of living, and understand freelance vs employee income.',
    cornerstoneSlug: 'what-is-a-good-salary',
  },
];

export function getPillar(id: string): Pillar | undefined {
  return pillars.find((pillar) => pillar.id === id);
}

export function getAllPillars(): Pillar[] {
  return pillars;
}
