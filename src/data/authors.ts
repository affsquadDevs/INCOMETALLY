/**
 * Author / reviewer profiles used for guide bylines and Article structured data.
 * Designed for E-E-A-T: consistent, identifiable authorship with a real bio and
 * a link to our editorial standards.
 */

export interface Author {
  id: string;
  name: string;
  type: 'Person' | 'Organization';
  role: string;
  bio: string;
  url: string; // profile / about link
}

export const authors: Record<string, Author> = {
  'editorial-team': {
    id: 'editorial-team',
    name: 'IncomeTally Editorial Team',
    type: 'Organization',
    role: 'Salary & Tax Research',
    bio: 'The IncomeTally Editorial Team researches and writes our guides using official, publicly available tax data — including the IRS (United States), HM Revenue & Customs (United Kingdom), and the German Federal Ministry of Finance. Every guide is reviewed for accuracy and updated when tax rules change. IncomeTally provides educational information only and does not offer financial, tax, or legal advice.',
    url: '/about-us',
  },
};

export function getAuthor(id?: string): Author {
  return authors[id ?? 'editorial-team'] ?? authors['editorial-team'];
}
