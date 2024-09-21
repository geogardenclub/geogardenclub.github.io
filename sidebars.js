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
  // By default, Docusaurus generates a sidebar from the docs folder structure
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
    ]
  },
    {
      type: 'category',
      collapsed: false,
      label: "User Guide",
      items: [
        'user-guide/overview',
        'user-guide/downloading',
        'user-guide/registration',
        'user-guide/define-a-garden',
        'user-guide/adding-plantings',
        'user-guide/explore-a-garden',
        'user-guide/explore-a-chapter',
        'user-guide/adding-vendors-crops-varieties',
        'user-guide/scenarios',
        'user-guide/observations',
        'user-guide/geobot',
        'user-guide/badges',
        'user-guide/outcomes',
        'user-guide/tasks',
        'user-guide/seeds',
        'user-guide/chat-rooms',
        'user-guide/guided-tour',
        'user-guide/terms-and-conditions',
        'user-guide/privacy',
        ]
    }],
  businessSidebar: [
    'business/index',
    'business/roadmap',
    'business/milestones',
    {
      type: 'link',
      label: 'Lean Canvas',
      href: 'https://docs.google.com/presentation/d/1oUzy1zeraTf6PgWlk2R3Ea7Iw2Ju24Dds5mffq2o5Wg/edit#slide=id.p1',
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
      type: 'link',
      label: 'Business Documents Repo',
      href: 'https://github.com/geogardenclub/documents',
    },
  ],
  developSidebar: [
    'develop/index',
    'develop/onboarding',
    'develop/installation',
    'develop/scripts',
    'develop/coding-standards',
    'develop/architecture',
    'develop/deployment',
    'develop/testing',
    'develop/backups',
    {
      type: 'category',
      collapsed: true,
      label: 'Design',
      items: [
        'develop/design/data-model',
        'develop/design/badges',
        'develop/design/input-fields',
        'develop/design/with-widgets',
        'develop/design/data-mutation',
        'develop/design/test-design',
      ],
    },
    {
      type: 'category',
      label: 'Release 1.0 (Technology Evaluation)',
      collapsed: true,
      items: [
        'develop/release-1.0/goals',
        'develop/release-1.0/cvp',
        'develop/release-1.0/onboarding-feedback',
        'develop/release-1.0/end-of-season-feedback',

      ],
    },
    {
      type: 'category',
      collapsed: true,
      label: 'Archive',
      items: [
        {
          type: 'category',
          collapsed: true,
          label: 'Mockup',
          items: [
            'develop/archive/mockup/design',
            'develop/archive/mockup/customer-feedback',
            'develop/archive/mockup/entrepreneur-feedback',
            'develop/archive/mockup/chatgpt-feedback',
          ],
        },
      ]
    },

  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

module.exports = sidebars;
