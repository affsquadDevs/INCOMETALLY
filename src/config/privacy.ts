export interface PrivacySection {
  title: string;
  paragraphs: string[];
  listItems?: string[];
  paragraphsAfterList?: string[];
}

export interface PrivacyPolicyConfig {
  lastUpdated: string;
  title: string;
  intro?: string;
  sections: PrivacySection[];
  contactEmail: string;
}

const contactEmail = 'hello@affsquad.com';

export const privacyPolicyConfig: PrivacyPolicyConfig = {
  lastUpdated: 'January 2026',
  title: 'Privacy Policy',
  contactEmail,
  intro: 'Welcome to IncomeTally ("we", "our", "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect information when you visit https://incometally.com (the "Website").',
  sections: [
    {
      title: '1. Information We Collect',
      paragraphs: [
        'We collect minimal information necessary to operate and improve the Website.',
        'a) Non-personal information',
        'When you visit the Website, we may automatically collect non-identifying information such as:',
      ],
      listItems: [
        'Browser type and version',
        'Device type and operating system',
        'Pages visited and time spent',
        'Approximate location (country-level only)',
      ],
      paragraphsAfterList: [
        'This data is aggregated and cannot be used to identify you personally.',
        'b) Personal information',
        'We do not require account registration and do not knowingly collect personal data such as names, email addresses, phone numbers, or payment information.',
        'If you contact us voluntarily (for example, via email), we will only use your information to respond to your inquiry.',
      ],
    },
    {
      title: '2. Cookies and Similar Technologies',
      paragraphs: [
        'IncomeTally uses cookies and similar technologies to:',
      ],
      listItems: [
        'Ensure proper website functionality',
        'Measure traffic and usage patterns',
        'Display relevant advertisements',
      ],
      paragraphsAfterList: [
        'Cookies do not give us access to your computer or personal data.',
        'You can disable cookies in your browser settings at any time. Please note that some parts of the Website may not function properly if cookies are disabled.',
      ],
    },
    {
      title: '3. Advertising (Google AdSense)',
      paragraphs: [
        'We use Google AdSense to display advertisements.',
        'Google and its partners may:',
      ],
      listItems: [
        'Use cookies (including the DoubleClick cookie)',
        'Serve ads based on your visits to this and other websites',
      ],
      paragraphsAfterList: [
        'You can learn how Google uses data from sites that use its services here:',
        '👉 https://policies.google.com/technologies/ads',
        'You may opt out of personalized advertising by visiting:',
        '👉 https://adssettings.google.com',
      ],
    },
    {
      title: '4. How We Use Information',
      paragraphs: [
        'We use collected information to:',
      ],
      listItems: [
        'Operate and maintain the Website',
        'Improve calculator accuracy and usability',
        'Analyze traffic and performance',
        'Comply with legal obligations',
      ],
      paragraphsAfterList: [
        'We do not sell, rent, or trade user information.',
      ],
    },
    {
      title: '5. Data Security',
      paragraphs: [
        'We implement reasonable technical and organizational measures to protect information against unauthorized access, alteration, or destruction.',
        'However, no method of transmission over the internet is 100% secure.',
      ],
    },
    {
      title: '6. Third-Party Links',
      paragraphs: [
        'The Website may contain links to third-party websites.',
        'We are not responsible for the privacy practices or content of those websites.',
      ],
    },
    {
      title: '7. Children\'s Information',
      paragraphs: [
        'IncomeTally is not directed to children under the age of 13.',
        'We do not knowingly collect personal data from children.',
      ],
    },
    {
      title: '8. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time.',
        'Any changes will be posted on this page with an updated "Last updated" date.',
      ],
    },
    {
      title: '9. Contact Us',
      paragraphs: [
        'If you have questions about this Privacy Policy, please contact us at:',
        `📧 ${contactEmail}`,
      ],
    },
  ],
};

