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
      label: "User Guide",
      items: [
        'user-guide/overview',
        {
          type: 'category',
          collapsed: true,
          label: "About GeoGardenClub",
          items: [
            'user-guide/home/welcome',
            'user-guide/home/serious-gardeners',
            'user-guide/home/innovations',
            'user-guide/home/team',
            'user-guide/home/contact-us',
          ]
        },
        {
          type: 'category',
          collapsed: true,
          label: "Featured Gardeners",
          link: {
            type: 'generated-index',
            title: 'Featured Gardeners',
            description: 'Get to know some GeoGardenClub users',
            slug: '/category/featured-gardeners',
          },
          items: [
            'user-guide/featured-gardeners/threse',
            'user-guide/featured-gardeners/jessie',
            'user-guide/featured-gardeners/margo',
            'user-guide/featured-gardeners/erin-shanna',
            'user-guide/featured-gardeners/jess',
            'user-guide/featured-gardeners/katie',
          ]
        },

        {
          type: 'category',
          collapsed: false,
          label: "Get Started",
          items: [
            'user-guide/get-started/overview',
            'user-guide/get-started/downloading',
            'user-guide/get-started/registration',
            'user-guide/get-started/user-profile',
            'user-guide/get-started/free-preview',
            'user-guide/get-started/subscriptions',
            'user-guide/get-started/home',
          ]
        },
        'user-guide/insights',
        'user-guide/gardens',
        'user-guide/beds',
        'user-guide/plantings',
        'user-guide/tasks',
        'user-guide/observations',
        'user-guide/outcomes',
        'user-guide/forums',
        'user-guide/crops',
        'user-guide/varieties',
        'user-guide/chapters',
        'user-guide/gardeners',
        'user-guide/retail-value',
        'user-guide/web',
        'user-guide/public-view',
        'user-guide/faq',
        'user-guide/markdown',
        'user-guide/school-and-community-gardens',
        'user-guide/settings',
        'user-guide/privacy',
        ]
    },
    ],
  businessSidebar: [
    'business-guide/index',
    'business-guide/roadmap',
    'business-guide/milestones',
    'business-guide/intern-onboarding',
    {
      type: 'category',
      collapsed: true,
      label: "2026 Strategic Plan",
      items: [
        'business-guide/strategic-plan-2026/index',
        'business-guide/strategic-plan-2026/review-2025',
        'business-guide/strategic-plan-2026/usability-2025',
        'business-guide/strategic-plan-2026/competitive-analysis-2025',
        'business-guide/strategic-plan-2026/customer-lifecycle',
        'business-guide/strategic-plan-2026/proposals-2026',
        'business-guide/strategic-plan-2026/benchmarks-2026',

      ]
    },
    {
      type: 'category',
      collapsed: true,
      label: "Monthly Reports",
      items: [
        {
          type: 'category',
          collapsed: true,
          label: "2025",
          items: [
            {
              type: 'link',
              label: 'March 2025',
              href: 'https://docs.google.com/document/d/1yLiiYTDcJsEFNh_BVZTMfb29lsb2yqZLwG4MxLIsIC4/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'April 2025',
              href: 'https://docs.google.com/document/d/1IwCf6fvT_NJnMSW1TxJ7lQJFCXyfXusoq9IbDTziMf8/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'May 2025',
              href: 'https://docs.google.com/document/d/1MIZPmjLCnuTUvT5gNUgO_E-u8ksb8gt8V1SCZM12Xs8/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'June 2025',
              href: 'https://docs.google.com/document/d/1kp_a0BokH-GdPsfg_o2fJyutoIpHekHUP2ohpkFtgVA/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'July 2025',
              href: 'https://docs.google.com/document/d/15nZf7dkdyI_dt8-fJL_PecJaEjnh5OdEdJls3KIQ23w/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'August 2025',
              href: 'https://docs.google.com/document/d/1O4tjvM2d6M2zM7E-FbUaA4EpSQAEeGkcorjasYOmsEM/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'September 2025',
              href: 'https://docs.google.com/document/d/1yTiznV5TjAM3Yqagt34Z6_oMTWuPePh0pPvGI2d6yFA/edit?usp=drive_link',
            },
            {
              type: 'link',
              label: 'October 2025',
              href: 'https://docs.google.com/document/d/1vfi-_YKRiX2kKyIEl6YfkK8UaoF2pm9cFGRh5J9mrHo/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'November 2025',
              href: 'https://docs.google.com/document/d/1dm2VkRp1CtLZTIZh8UH3HmpsVej7PXqK-z0gPNpokO0/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'December 2025',
              href: 'https://docs.google.com/document/d/1ltXL3Wc9HmZ7CCaIfU4bJNr_CWGCSNa9oyb0hUBdquY/edit?usp=sharing',
            },
          ]
        },
        {
          type: 'category',
          collapsed: true,
          label: "2026",
          items: [
            {
              type: 'link',
              label: 'January 2026',
              href: 'https://docs.google.com/document/d/1ltXL3Wc9HmZ7CCaIfU4bJNr_CWGCSNa9oyb0hUBdquY/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'January 2026',
              href: 'https://docs.google.com/document/d/1S1DwC85gLyjeIZaiOMXA5PlKmM3IvY0952sjviwddrk/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'February 2026',
              href: 'https://docs.google.com/document/d/19VNB9bzUQCxCVxSRCWbnpFsjnabb9nWE3QQ-pRY4DmU/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'March 2026',
              href: 'https://docs.google.com/document/d/1kYN3QmmoqqflmxYS3RHcXm1sZYxp-smzpobOBar-Hpg/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'April 2026',
              href: 'https://docs.google.com/document/d/1Gj5Ps_uIf3FNFBp0ZpwMQja5WWCY_zs2tE66ll4byZM/edit?usp=sharing',
            },
            {
              type: 'link',
              label: 'May 2026',
              href: 'https://docs.google.com/document/d/1W5k6Y_gpFzdIDEHKnWu5LJVa0H-zUHZ9Y6PpBqw00uk/edit?usp=sharing',
            },
          ]
        },
      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: "Documents",
      items: [
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
      ]
    },
    {
      type: 'category',
      collapsed: true,
      label: "Archive",
      items: [
        {
          type: 'category',
          collapsed: true,
          label: "2024 Business Plan",
          items: [
            'business-guide/planning/market-size',
            'business-guide/planning/metrics',
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
          ]
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
      ],
    },

    {
      type: 'link',
      label: 'Developer Guide',
      href: '/docs/developer-guide/',
    },
    {
      type: 'link',
      label: 'Administrator Guide',
      href: '/docs/admin-guide/',
    }
  ],
  developSidebar: [
    'developer-guide/index',
    'developer-guide/onboarding',
    'developer-guide/installation',
    'developer-guide/architecture',
    {
      type: 'category',
      collapsed: false,
      label: 'Data Models',
      items: [
        'developer-guide/data-model/document-data-model',
        'developer-guide/data-model/cloud-storage-data-model',
      ],
    },
    'developer-guide/database-management',
    'developer-guide/deployment',
    'developer-guide/screenshots',
    'developer-guide/backups',
    'developer-guide/scripts',
    'developer-guide/privacy',
    'developer-guide/instrumentation',
    'developer-guide/firebase-billing',
    {
      type: 'category',
      collapsed: true,
      label: 'Design Patterns',
      items: [
        'developer-guide/design/features',
        'developer-guide/design/ids',
        'developer-guide/design/input-management',
        'developer-guide/design/with-widgets',
        'developer-guide/design/data-mutation',
        'developer-guide/design/entity-creation',
        'developer-guide/design/badges',
        'developer-guide/design/retail-value',
        'developer-guide/design/collection-classes',
        'developer-guide/design/sort-by',
        'developer-guide/design/adaptive-design',
      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: 'Quality Assurance',
      items: [
        'developer-guide/quality-assurance/coding-standards',
        'developer-guide/quality-assurance/dart-analyze',
        'developer-guide/quality-assurance/testing',
        'developer-guide/quality-assurance/integrity-check',
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
            'developer-guide/releases/release-1.0/goals',
            'developer-guide/releases/release-1.0/cvp',
            'developer-guide/releases/release-1.0/onboarding-feedback',
            'developer-guide/releases/release-1.0/end-of-season-feedback',

          ],
        },
        {
          type: 'category',
          collapsed: true,
          label: 'Release 0.0 (Mockup)',
          items: [
            'developer-guide/releases/release-0.0/design',
            'developer-guide/releases/release-0.0/customer-feedback',
            'developer-guide/releases/release-0.0/entrepreneur-feedback',
            'developer-guide/releases/release-0.0/chatgpt-feedback',
          ],
        },
      ]
    },
    {
      type: 'link',
      label: 'Business Development Guide',
      href: '/docs/business-guide/',
    },
  ],
  adminSidebar: [
      'admin-guide/index',
      {
        type: 'category',
        collapsed: true,
        label: 'Database Management',
        items: [
            'admin-guide/database-management/overview',
            'admin-guide/database-management/integrity-check',
            'admin-guide/database-management/cloud-storage-integrity-check',
            'admin-guide/database-management/database-operation',
            'admin-guide/database-management/database-refactoring',
        ]
      },
      {
        type: 'category',
        collapsed: true,
        label: 'Feature Management',
        items: [
            'admin-guide/feature-management/overview',
            'admin-guide/feature-management/activities',
            'admin-guide/feature-management/badges',
            {
              type: 'category',
              collapsed: true,
              label: 'Manage Chapters',
              items: [
                'admin-guide/feature-management/chapters',
                      'admin-guide/feature-management/chapters/manage-chapters',
                      'admin-guide/feature-management/chapters/create',
                      'admin-guide/feature-management/chapters/update',

                'admin-guide/feature-management/chapters/message-chapters',
                'admin-guide/feature-management/chapters/post-chapter-update',
              ]
            },
          {
            type: 'category',
            collapsed: true,
            label: 'Manage Crops',
            items: [
              'admin-guide/feature-management/crops',
              'admin-guide/feature-management/crops/create',
              'admin-guide/feature-management/crops/update',
              'admin-guide/feature-management/crops/delete',
            ]
          },
          {
            type: 'category',
            collapsed: true,
            label: 'Manage Families',
            items: [
              'admin-guide/feature-management/families',
              'admin-guide/feature-management/families/create',
              'admin-guide/feature-management/families/update',
              'admin-guide/feature-management/families/delete',
           ]
          },
          {
            type: 'category',
            collapsed: true,
            label: 'Manage Forums',
            items: [
              'admin-guide/feature-management/forums',
              'admin-guide/feature-management/forums/topics',
              'admin-guide/feature-management/forums/messages',
              'admin-guide/feature-management/forums/broadcast',
              'admin-guide/feature-management/forums/delete',
            ]
          },
          {
            type: 'category',
            collapsed: true,
            label: 'Manage Plantings',
            items: [
              'admin-guide/feature-management/plantings',
              'admin-guide/feature-management/plantings/planting-details',
              'admin-guide/feature-management/plantings/edit-basic-info',
              'admin-guide/feature-management/plantings/copy-planting',
            ]
          },
          {
            type: 'category',
            collapsed: true,
            label: 'Manage Prices',
            items: [
              'admin-guide/feature-management/prices/manage',
              'admin-guide/feature-management/prices/create',
              'admin-guide/feature-management/prices/update',
              'admin-guide/feature-management/prices/delete',
            ]
          },
          {
            type: 'category',
            collapsed: true,
            label: 'Manage Tags',
            items: [
              'admin-guide/feature-management/tags/manage',
              'admin-guide/feature-management/tags/create',
              'admin-guide/feature-management/tags/update',
              'admin-guide/feature-management/tags/delete',
            ]
          },
          'admin-guide/feature-management/tasks',
          {
            type: 'category',
            collapsed: true,
            label: 'Manage Users',
            items: [
              'admin-guide/feature-management/users/manage',
              'admin-guide/feature-management/users/blocked',
              'admin-guide/feature-management/users/migrate',
              'admin-guide/feature-management/users/delete',
            ]
          },
          {
            type: 'category',
            collapsed: true,
            label: 'Manage Varieties',
            items: [
              'admin-guide/feature-management/varieties',
              'admin-guide/feature-management/varieties/manage',
              'admin-guide/feature-management/varieties/create',
              'admin-guide/feature-management/varieties/update',
              'admin-guide/feature-management/varieties/delete',
              'admin-guide/feature-management/varieties/gold',
            ]
          },
        ]
      },

    'admin-guide/refresh-caches/overview',
    'admin-guide/set-images/overview',
    'admin-guide/view-onboarding-screens',
    {
      type: 'category',
      collapsed: true,
      label: 'Instrumentation',
      items: [
        'admin-guide/instrumentation/overview',
        'admin-guide/instrumentation/event-log',
        'admin-guide/instrumentation/event-table',
        'admin-guide/instrumentation/user-journey',
        'admin-guide/instrumentation/set-retrieval-dates'
      ]
    },
  ]
};

module.exports = sidebars;
