import Link from 'next/link';
import { getCountrySources } from '@/data/sources';

interface DataSourcesProps {
  countryCode: string;
  countryName: string;
}

/**
 * "Data sources" box shown on each country calculator page.
 * Lists the official government / tax-authority sources the figures are checked
 * against — a transparency and E-E-A-T signal.
 */
export default function DataSources({ countryCode, countryName }: DataSourcesProps) {
  const sources = getCountrySources(countryCode);
  if (sources.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 lg:p-8">
        <h2 className="text-2xl font-normal text-black mb-3">Data sources</h2>
        <p className="text-sm text-black opacity-80 leading-relaxed mb-4">
          Our {countryName} estimates are based on publicly available figures from official
          government and tax-authority sources. Rates and thresholds change each tax year, so we
          review them periodically. These results are estimates, not official tax assessments or
          advice.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm mb-4">
          {sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[#0066FF] hover:underline"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-black opacity-70">
          See our{' '}
          <Link href="/about-us" className="text-[#0066FF] hover:underline">
            editorial standards
          </Link>{' '}
          for how we research and update this data.
        </p>
      </div>
    </section>
  );
}
