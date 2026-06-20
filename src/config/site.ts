import { blogs } from '@/data/blogs';

export const siteConfig = {
  // Site Information
  domain: 'https://incometally.com', // Site domain (used for robots.txt, sitemap, etc.)
  name: 'Income Tally',
  tagline: 'Net Salary Calculator',
  description: 'Calculate your net salary after taxes with accurate, country-specific estimates.',
  
  // Logo and Branding
  logo: {
    image: '/images/Logo.png', // Path to logo image (used site-wide)
    linkText: 'Income Tally', // Site name as link text to home page
  },
  
  // Blogs
  blogs,

  // Contact Information
  contact: {
    email: 'hello@affsquad.com',
    // phone: '+1 (555) 123-4567',
    // address: '123 Business St, Suite 100, San Francisco, CA 94105',
  },

  // Navigation
  nav: {
    links: [
      // { label: 'Team', href: '/team' },
      // { label: 'Portfolio', href: '/portfolio' },
      { label: 'Salary Calculator', href: '/salary-calculator' },
      { label: 'Get Started', href: '/calculator' },
      { label: 'About Us', href: '/about-us' },
      // { label: 'Manifesto', href: '/manifesto' },
      { label: 'Guides', href: '/guides' },
    ],
  },

  // FOOTER
  footer: {
    calculatorLinkLabel: 'Calculator',
    product: {
      title: 'PRODUCT',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Calculator', href: '/calculator' }, // Uses calculatorLinkLabel from footer
      ],
    },
    legal: {
      title: 'LEGAL',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
    resources: {
      title: 'RESOURCES',
      links: [
        { label: 'Salary Calculator Hub', href: '/salary-calculator' },
        { label: 'Hourly to Salary', href: '/hourly-to-salary' },
        { label: 'Guides', href: '/guides' },
      ],
    },
    disclaimer: 'IncomeTally provides income and tax calculators for informational purposes only. Results are estimates and may not reflect actual tax obligations or financial outcomes. This website does not provide financial, tax, or legal advice. Always consult a qualified professional for personalized guidance.',
  },

  // Contact Page Content
  contactPage: {
    title: 'Contact Us',
    subtitle: 'If you have questions about IncomeTally, our calculators, or how the website works, you can reach us using the contact information below.',
    inquiryTypes: {
      title: 'We welcome inquiries related to:',
      items: [
        'general questions about the platform',
        'project estimation and planning features',
        'privacy and data handling',
        'technical issues or feedback',
        'legal or policy-related matters',
      ],
    },
    howToContact: {
      title: 'How to Contact Us',
      email: {
        label: 'Email:',
        value: 'hello@affsquad.com',
        note: 'We aim to respond to all legitimate inquiries within a reasonable timeframe.',
      },
    },
    aboutCommunication: {
      title: 'About Communication',
      description: 'IncomeTally is an independent online service that provides income, salary, and tax calculators based on the information you enter.',
      notes: [
        'We do not offer customer support via social media and do not provide phone support at this time.',
        'Please do not send sensitive personal information by email unless it is necessary to address your request.',
      ],
    },
  },

  // Home Page Content
  home: {
    hero: {
      title: 'Net Salary Calculator',
      subtitle: 'Calculate your net salary after taxes with accurate, country-specific estimates.',
      ctaPrimary: 'Get Started',
      ctaSecondary: 'Learn More',
    },
    features: {
      title: 'Why Use Our Salary Calculator?',
      subtitle: 'Clear, fast, and country-specific net salary estimates you can trust.',
      items: [
        {
          title: 'Accurate Tax Estimates',
          description: 'Up-to-date tax rules We calculate your net salary using country-specific tax brackets and social contributions, so you see realistic take-home pay - not rough guesses.',
          icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        },
        {
          title: 'No Signup Required',
          description: 'Anonymous & private Use the calculator instantly without creating an account. Your inputs stay in your browser - simple, fast, and privacy-friendly.',
          icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        },
        {
          title: 'Built for Multiple Countries',
          description: 'Hourly, monthly, or yearly Convert income and estimate taxes for different countries and pay types - hourly rates, monthly salaries, or annual income.',
          icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
        },
      ],
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Use our free calculators to estimate your net salary and take-home pay in seconds.',
      button: 'Contact Us Today',
    },
    metric: {
    //   label: 'Primary Metric',
      value: '15,480',
      change: 88.2, // percentage change
      subtitle: 'Compared to previous period',
      chartData: [45, 52, 48, 61, 55, 58, 65, 62, 68, 72, 75, 80, 78, 82, 85, 88, 90, 92, 95, 100], // optional: custom chart data
    },
  },

  // About Us Page Content
  aboutUs: {
    lastUpdated: 'January 4, 2026',
    title: 'About Us',
    content: `IncomeTally is an independent online tool created to help individuals and professionals calculate income, salary, and tax estimates in a clear, structured, and transparent way.

Understanding your take-home pay and tax obligations requires accurate calculations based on current tax laws, brackets, and deductions. In practice, salary and tax calculations are often complex and vary by country, making it difficult to get accurate estimates. IncomeTally brings these calculations together in one place, making financial planning more consistent and easier to manage.

The platform allows users to calculate net salary from gross income, convert between hourly and annual rates, and estimate taxes based on country-specific tax rules. IncomeTally is designed as a calculation and estimation tool - helping users understand their actual take-home pay and plan their finances accordingly.

IncomeTally does not provide financial, tax, or legal advice. All calculations are estimates based on publicly available tax data and are intended for informational and planning purposes only.

Our goal is to offer a simple and practical experience for financial planning and decision-making. IncomeTally is an independent product and is not affiliated with tax authorities, financial institutions, or third-party service providers.

## Our Editorial Standards

IncomeTally's guides are written and reviewed by the IncomeTally Editorial Team. We follow a few simple principles to keep our content trustworthy:

- **Official sources.** Our tax and salary guides are based on publicly available data from authorities such as the U.S. Internal Revenue Service (IRS), the UK's HM Revenue & Customs (HMRC), and the German Federal Ministry of Finance. Key articles list their sources at the end.
- **Plain language.** We explain income, tax, and salary topics in clear terms, with worked examples, so they are useful to people without a finance background.
- **Kept current.** Tax rules change every year. We review our guides and show a "Last updated" date on each one so you know how recent the information is.
- **Estimates, not advice.** Our calculators and guides provide general, educational estimates. They are not financial, tax, or legal advice, and individual circumstances vary. For decisions that affect your money, consult a qualified professional.

If you spot something that looks out of date or incorrect, please [contact us](/contact) — we welcome corrections.`,
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What is IncomeTally?',
          answer: 'IncomeTally is an online income and tax calculator tool. It helps users calculate net salary, estimate taxes, and convert between different income formats (hourly, monthly, annual) based on country-specific tax rules.',
        },
        {
          question: 'Who is IncomeTally for?',
          answer: 'IncomeTally is designed for employees, freelancers, job seekers, and anyone who wants to understand their take-home pay and tax obligations during salary negotiations or financial planning.',
        },
        {
          question: 'Do I need to create an account to use IncomeTally?',
          answer: 'No. IncomeTally can be used without creating an account. All inputs are provided voluntarily by the user.',
        },
        {
          question: 'Does IncomeTally provide financial or tax advice?',
          answer: 'No. IncomeTally does not provide financial, tax, or legal advice. It is strictly a calculation and estimation tool for informational purposes only.',
        },
        {
          question: 'Is IncomeTally affiliated with tax authorities or financial institutions?',
          answer: 'No. IncomeTally operates independently and has no affiliation with tax authorities, financial institutions, or third-party platforms.',
        },
        {
          question: 'Is IncomeTally free to use?',
          answer: 'IncomeTally offers free access to its core calculation features. Additional features or changes may be introduced in the future.',
        },
      ],
    },
  },
};

