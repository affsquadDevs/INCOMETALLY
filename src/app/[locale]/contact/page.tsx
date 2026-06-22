import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getContact } from '@/lib/content';
import { buildAlternates } from '@/i18n/seo';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const contactPage = getContact(locale);
  return {
    title: contactPage.title,
    description:
      'Get in touch with the IncomeTally team. Questions about our calculators, privacy, or feedback are welcome.',
    alternates: buildAlternates(locale, '/contact'),
    openGraph: {
      title: contactPage.title,
      description:
        'Get in touch with the IncomeTally team. Questions about our calculators, privacy, or feedback are welcome.',
      url: '/contact',
      type: 'website',
    },
  };
}

export default async function Contact({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const contactPage = getContact(locale);
  const { contact } = siteConfig;

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <div className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-normal text-black mb-4 tracking-[-0.02em]">
            {contactPage.title}
          </h1>
          <p className="text-lg lg:text-xl text-black max-w-2xl opacity-90 leading-relaxed">
            {contactPage.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-sm border border-black border-opacity-10 p-8 md:p-12 space-y-8">
          {/* Inquiry Types */}
          <div>
            <h2 className="text-2xl font-normal text-black mb-4">
              {contactPage.inquiryTypes.title}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-black opacity-80 ml-4">
              {contactPage.inquiryTypes.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* How to Contact */}
          <div>
            <h2 className="text-2xl font-normal text-black mb-4">
              {contactPage.howToContact.title}
            </h2>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="font-normal text-black mr-2">
                  {contactPage.howToContact.email.label}
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[#0066FF] hover:opacity-70 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
              <p className="text-black text-sm mt-2 opacity-70">
                {contactPage.howToContact.email.note}
              </p>
            </div>
          </div>

          {/* About Communication */}
          <div className="pt-6 border-t border-black border-opacity-10">
            <h2 className="text-2xl font-normal text-black mb-4">
              {contactPage.aboutCommunication.title}
            </h2>
            <p className="text-black mb-4 opacity-80">
              {contactPage.aboutCommunication.description}
            </p>
            <ul className="space-y-2 text-black opacity-80">
              {contactPage.aboutCommunication.notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
