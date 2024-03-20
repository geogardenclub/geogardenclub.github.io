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
      'home/motivation',
      'home/innovations',
      'home/related-work',
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
        'user-guide/your-first-garden',
        'user-guide/adding-vendors-crops-varieties',
        'user-guide/observations',
        'user-guide/badges',
        'user-guide/outcomes',
        'user-guide/tasks',
        'user-guide/seeds',
        'user-guide/chat-rooms',
        'user-guide/guided-tour',
        'user-guide/terms-and-conditions',
        ]
    }],
  developSidebar: [
    'develop/index',
    'develop/roadmap',
    'develop/onboarding',
    {
      type: 'category',
      collapsed: true,
      label: 'Mockup',
      items: [
        'develop/mockup/design',
        'develop/mockup/customer-feedback',
        'develop/mockup/entrepreneur-feedback',
        'develop/mockup/chatgpt-feedback',
      ],
    },
    {
      type: 'category',
      label: 'Release 1.0 (Beta)',
      collapsed: true,
      items: [
        'develop/release-1.0/goals',
        'develop/release-1.0/installation',
        'develop/release-1.0/scripts',
        'develop/release-1.0/cvp',
        'develop/release-1.0/deployment',
        'develop/release-1.0/architecture',
        'develop/release-1.0/coding-standards',
        'develop/release-1.0/beta-test-feedback',
        {
          type: 'category',
          collapsed: true,
          label: 'Design Components',
          items: [
            'develop/release-1.0/design-components/data-model',
            'develop/release-1.0/design-components/badges',
            'develop/release-1.0/design-components/input-fields',
            'develop/release-1.0/design-components/with-widgets',
            'develop/release-1.0/design-components/data-mutation',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Release 2.0 (Public)',
      collapsed: true,
      items: [
        'develop/release-2.0/chapterzipmap',
      ],
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
