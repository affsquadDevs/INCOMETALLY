import Link from 'next/link';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('calculator');
  const sources = getCountrySources(countryCode);
  if (sources.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 lg:p-8">
        <h2 className="text-2xl font-normal text-black mb-3">{t('dataSources.heading')}</h2>
        <p className="text-sm text-black opacity-80 leading-relaxed mb-4">
          {t('dataSources.intro', { country: countryName })}
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
          {t('dataSources.editorialPrefix')}{' '}
          <Link href="/about-us" className="text-[#0066FF] hover:underline">
            {t('dataSources.editorialLink')}
          </Link>{' '}
          {t('dataSources.editorialSuffix')}
        </p>
      </div>
    </section>
  );
}
