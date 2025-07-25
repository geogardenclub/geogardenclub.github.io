/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  homeSidebar: [
    {
    type: 'category',
    collapsed: false,
    label: "About GeoGardenClub",
    items: [
      'home/welcome',
      'home/serious-gardeners',
      'home/innovations',
      'home/related-work',
      'home/food-security',
      'home/team',
      'home/contact-us',
    ]
  },
    {
      type: 'category',
      collapsed: false,
      label: "User Guide",
      items: [
        'user-guide/overview',

        {
          type: 'category',
          collapsed: false,
          label: "Get Started",
          items: [
            'user-guide/get-started/overview',
            'user-guide/get-started/downloading',
            'user-guide/get-started/registration',
            'user-guide/get-started/user-profile',
            'user-guide/get-started/subscriptions',
            'user-guide/get-started/home',
          ]
        },
        'user-guide/gardens',
        'user-guide/beds',
        'user-guide/plantings',
        'user-guide/tasks',
        'user-guide/observations',
        'user-guide/outcomes',
        'user-guide/chat-rooms',
        'user-guide/sharing',
        'user-guide/crops',
        'user-guide/varieties',
        'user-guide/chapters',
        'user-guide/gardeners',
        'user-guide/retail-value',
        'user-guide/faq',
        'user-guide/school-and-community-gardens',
        'user-guide/settings',
        'user-guide/privacy',
        ]
    }],
  businessSidebar: [
    'business/index',
    'business/roadmap',
    'business/milestones',
    'business/market-size',
    'business/metrics',
    'business/instrumentation',
    {
      type: 'category',
      collapsed: false,
      label: "Monthly Reports",
      items: [
        {
          type: 'link',
          label: 'June 2025',
          href: 'https://docs.google.com/document/d/1kp_a0BokH-GdPsfg_o2fJyutoIpHekHUP2ohpkFtgVA/edit?usp=sharing',
        },
        {
          type: 'link',
          label: 'May 2025',
          href: 'https://docs.google.com/document/d/1MIZPmjLCnuTUvT5gNUgO_E-u8ksb8gt8V1SCZM12Xs8/edit?usp=sharing',
        },
        {
          type: 'link',
          label: 'April 2025',
          href: 'https://docs.google.com/document/d/1IwCf6fvT_NJnMSW1TxJ7lQJFCXyfXusoq9IbDTziMf8/edit?usp=sharing',
        },
        {
          type: 'link',
          label: 'March 2025',
          href: 'https://docs.google.com/document/d/1yLiiYTDcJsEFNh_BVZTMfb29lsb2yqZLwG4MxLIsIC4/edit?usp=sharing',
        },
      ]
    },
    {
      type: 'link',
      label: 'Lean Canvas',
      href: 'https://www.canva.com/design/DAGXUaJ5nBg/gH6EnJ74rFjfqZYjJ2n50w/view?utm_content=DAGXUaJ5nBg&utm_campaign=designshare&utm_medium=link&utm_source=editor',
    },
    {
          type: 'link',
          label: 'Executive Summary',
          href: 'https://geogardenclub.com/pdf/executive-summary-2024.pdf',
        },
    {
      type: 'link',
      label: 'Gardening vs. Farming',
      href: 'https://docs.google.com/presentation/d/1rMu7DWJblHvVJt6CGmR8eyCN7uBMXPfBpc1rdhanxjQ/edit#slide=id.p',
    },
    {
      type: 'link',
      label: 'Home Gardening Pain Points',
      href: 'https://docs.google.com/presentation/d/1TKDWQI60PxRhBpMGW0tvMyXX0nmgEBz71-DmoT2LxfU/edit#slide=id.g11d82564388_0_187',
    },
    {
      type: 'category',
      collapsed: true,
      label: 'BAI 2024',
      items: [
        {
          type: 'link',
          label: 'BAI 2024 Pitch Deck',
          href: 'https://geogardenclub.com/pdf/bai-pitch-2024.pdf',
        },
        {
          type: 'link',
          label: 'BAI 2024 Pitch (Video)',
          href: 'https://www.youtube.com/watch?v=fo2fP-915VQ',
        },
      ],
    },
    {
      type: 'link',
      label: 'Business Documents Repo',
      href: 'https://github.com/geogardenclub/documents',
    },
    {
      type: 'link',
      label: 'Consultant Agreement Template',
      href: 'https://docs.google.com/document/d/1UIgKYQrcIaY7wj515ehPrFTm1sqXfiYSNWUZvoTEWBY/edit?tab=t.0',
    },
    {
      type: 'link',
      label: 'Developer Guide',
      href: '/docs/develop/',
    },
  ],
  developSidebar: [
    'develop/index',
    'develop/onboarding',
    'develop/installation',
    'develop/architecture',
    {
      type: 'category',
      collapsed: false,
      label: 'Data Models',
      items: [
        'develop/data-model/document-data-model',
        'develop/data-model/cloud-storage-data-model',
      ],
    },
    'develop/database-management',
    'develop/deployment',
    'develop/screenshots',
    'develop/backups',
    'develop/scripts',
    'develop/privacy',
    'develop/firebase-billing',
    'develop/adaptive-design',
    {
      type: 'category',
      collapsed: true,
      label: 'Design Patterns',
      items: [
        'develop/design/features',
        'develop/design/ids',
        'develop/design/input-management',
        'develop/design/with-widgets',
        'develop/design/data-mutation',
        'develop/design/entity-creation',
        'develop/design/badges',
      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: 'Quality Assurance',
      items: [
        'develop/quality-assurance/coding-standards',
        'develop/quality-assurance/dart-analyze',
        'develop/quality-assurance/testing',
        'develop/quality-assurance/integrity-check',
      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: 'Prior Releases',
      items: [
        {
          type: 'category',
          label: 'Release 1.0 (Technology Evaluation)',
          collapsed: true,
          items: [
            'develop/releases/release-1.0/goals',
            'develop/releases/release-1.0/cvp',
            'develop/releases/release-1.0/onboarding-feedback',
            'develop/releases/release-1.0/end-of-season-feedback',

          ],
        },
        {
          type: 'category',
          collapsed: true,
          label: 'Release 0.0 (Mockup)',
          items: [
            'develop/releases/release-0.0/design',
            'develop/releases/release-0.0/customer-feedback',
            'develop/releases/release-0.0/entrepreneur-feedback',
            'develop/releases/release-0.0/chatgpt-feedback',
          ],
        },
      ]
    },
    {
      type: 'link',
      label: 'Business Development Guide',
      href: '/docs/business/',
    },
  ],
};

module.exports = sidebars;
