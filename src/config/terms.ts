export interface TermsSection {
  title: string;
  paragraphs: string[];
  listItems?: string[];
  paragraphsAfterList?: string[];
}

export interface TermsOfServiceConfig {
  lastUpdated: string;
  title: string;
  intro?: string;
  sections: TermsSection[];
  contactEmail: string;
}

const contactEmail = 'hello@affsquad.com';

export const termsOfServiceConfig: TermsOfServiceConfig = {
  lastUpdated: 'January 2026',
  title: 'Terms of Service',
  contactEmail,
  intro: 'By accessing or using https://incometally.com ("Website"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Website.',
  sections: [
    {
      title: '1. Use of the Website',
      paragraphs: [
        'IncomeTally provides income, salary, and tax calculators for informational and educational purposes only.',
        'You agree to use the Website:',
      ],
      listItems: [
        'Lawfully',
        'For personal, non-commercial purposes',
        'Without attempting to disrupt or misuse its functionality',
      ],
    },
    {
      title: '2. No Professional Advice',
      paragraphs: [
        'The information and calculators provided on IncomeTally do not constitute financial, tax, legal, or accounting advice.',
        'Calculations are estimates based on simplified assumptions and publicly available data.',
        'You should consult a qualified professional before making financial or tax decisions.',
      ],
    },
    {
      title: '3. Accuracy of Information',
      paragraphs: [
        'While we strive to keep information accurate and up to date:',
      ],
      listItems: [
        'We do not guarantee completeness, accuracy, or reliability',
        'Tax laws and regulations change frequently',
        'Results may differ from official or real-world outcomes',
      ],
      paragraphsAfterList: [
        'Use of the Website is at your own risk.',
      ],
    },
    {
      title: '4. Intellectual Property',
      paragraphs: [
        'All content on IncomeTally, including:',
      ],
      listItems: [
        'Text',
        'Design',
        'Calculator logic',
        'Branding',
      ],
      paragraphsAfterList: [
        'is the property of IncomeTally unless otherwise stated and is protected by applicable intellectual property laws.',
        'You may not copy, reproduce, or redistribute content without prior written permission.',
      ],
    },
    {
      title: '5. Third-Party Services',
      paragraphs: [
        'The Website may use third-party services (such as analytics and advertising providers).',
        'We are not responsible for the content, policies, or practices of third-party services or websites.',
      ],
    },
    {
      title: '6. Limitation of Liability',
      paragraphs: [
        'To the fullest extent permitted by law:',
      ],
      listItems: [
        'IncomeTally shall not be liable for any direct, indirect, or consequential damages',
        'Including financial loss or decision-making outcomes',
        'Arising from the use of or reliance on the Website',
      ],
    },
    {
      title: '7. Modifications to the Service',
      paragraphs: [
        'We reserve the right to:',
      ],
      listItems: [
        'Modify or discontinue any part of the Website',
        'Update these Terms at any time',
      ],
      paragraphsAfterList: [
        'Changes become effective upon posting.',
      ],
    },
    {
      title: '8. Governing Law',
      paragraphs: [
        'These Terms shall be governed by and interpreted in accordance with applicable laws, without regard to conflict of law principles.',
      ],
    },
    {
      title: '9. Contact Information',
      paragraphs: [
        'For questions regarding these Terms, contact us at:',
        `📧 ${contactEmail}`,
      ],
    },
  ],
};

