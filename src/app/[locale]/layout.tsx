import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { siteConfig } from '@/config/site';
import { routing, type Locale } from '@/i18n/routing';

// Maps next-intl locale codes to OpenGraph locale identifiers.
const ogLocaleMap: Record<string, string> = {
  en: 'en_US',
  pl: 'pl_PL',
  es: 'es_ES',
  pt: 'pt_PT',
  fr: 'fr_FR',
  it: 'it_IT',
  de: 'de_DE',
  uk: 'uk_UA',
  sv: 'sv_SE',
  cs: 'cs_CZ',
  el: 'el_GR',
};

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return {
    metadataBase: new URL(siteConfig.domain),
    title: {
      default: `${siteConfig.name} - ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    icons: {
      icon: '/favicon.ico',
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title: `${siteConfig.name} - ${siteConfig.tagline}`,
      description: siteConfig.description,
      url: siteConfig.domain,
      locale: ogLocaleMap[locale] ?? 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} - ${siteConfig.tagline}`,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Site-wide structured data: identifies the brand entity and the site to search engines
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteConfig.domain}/#organization`,
      name: siteConfig.name,
      url: siteConfig.domain,
      logo: `${siteConfig.domain}${siteConfig.logo.image}`,
      email: siteConfig.contact.email,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.domain}/#website`,
      name: siteConfig.name,
      url: siteConfig.domain,
      description: siteConfig.description,
      publisher: { '@id': `${siteConfig.domain}/#organization` },
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Google Tag Manager - Deferred for better performance */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N5JD3SV7');`,
          }}
        />
        {/* Google AdSense - Deferred for better performance */}
        <script
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2980943706375055"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#F5F5F0]">
        {/* Organization & WebSite structured data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N5JD3SV7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
