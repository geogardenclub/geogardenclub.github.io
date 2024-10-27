import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', '0c4'),
    exact: true
  },
  {
    path: '/blog/2023/02/10/welcome',
    component: ComponentCreator('/blog/2023/02/10/welcome', '229'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '245'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '70b'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '31b'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'ad3'),
            routes: [
              {
                path: '/docs/business',
                component: ComponentCreator('/docs/business', '896'),
                exact: true,
                sidebar: "businessSidebar"
              },
              {
                path: '/docs/business/market-size',
                component: ComponentCreator('/docs/business/market-size', '3a5'),
                exact: true,
                sidebar: "businessSidebar"
              },
              {
                path: '/docs/business/milestones',
                component: ComponentCreator('/docs/business/milestones', '6b2'),
                exact: true,
                sidebar: "businessSidebar"
              },
              {
                path: '/docs/business/roadmap',
                component: ComponentCreator('/docs/business/roadmap', '2c2'),
                exact: true,
                sidebar: "businessSidebar"
              },
              {
                path: '/docs/develop',
                component: ComponentCreator('/docs/develop', '48a'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/architecture',
                component: ComponentCreator('/docs/develop/architecture', '0cc'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/backups',
                component: ComponentCreator('/docs/develop/backups', 'e5f'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/coding-standards',
                component: ComponentCreator('/docs/develop/coding-standards', '001'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/deployment',
                component: ComponentCreator('/docs/develop/deployment', '87a'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/design/badges',
                component: ComponentCreator('/docs/develop/design/badges', 'fc0'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/design/data-model',
                component: ComponentCreator('/docs/develop/design/data-model', 'c3c'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/design/data-model-old',
                component: ComponentCreator('/docs/develop/design/data-model-old', '1c8'),
                exact: true
              },
              {
                path: '/docs/develop/design/data-mutation',
                component: ComponentCreator('/docs/develop/design/data-mutation', '7ce'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/design/input-fields',
                component: ComponentCreator('/docs/develop/design/input-fields', 'bde'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/design/with-widgets',
                component: ComponentCreator('/docs/develop/design/with-widgets', '9f7'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/installation',
                component: ComponentCreator('/docs/develop/installation', '7f5'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/onboarding',
                component: ComponentCreator('/docs/develop/onboarding', 'd33'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/releases/release-0.0/chatgpt-feedback',
                component: ComponentCreator('/docs/develop/releases/release-0.0/chatgpt-feedback', '596'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/releases/release-0.0/customer-feedback',
                component: ComponentCreator('/docs/develop/releases/release-0.0/customer-feedback', 'fb7'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/releases/release-0.0/design',
                component: ComponentCreator('/docs/develop/releases/release-0.0/design', '35c'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/releases/release-0.0/entrepreneur-feedback',
                component: ComponentCreator('/docs/develop/releases/release-0.0/entrepreneur-feedback', 'c03'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/releases/release-1.0/cvp',
                component: ComponentCreator('/docs/develop/releases/release-1.0/cvp', '391'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/releases/release-1.0/end-of-season-feedback',
                component: ComponentCreator('/docs/develop/releases/release-1.0/end-of-season-feedback', 'a2f'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/releases/release-1.0/goals',
                component: ComponentCreator('/docs/develop/releases/release-1.0/goals', '088'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/releases/release-1.0/onboarding-feedback',
                component: ComponentCreator('/docs/develop/releases/release-1.0/onboarding-feedback', 'e62'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/scripts',
                component: ComponentCreator('/docs/develop/scripts', 'c76'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/develop/testing',
                component: ComponentCreator('/docs/develop/testing', 'ed4'),
                exact: true,
                sidebar: "developSidebar"
              },
              {
                path: '/docs/home/food-security',
                component: ComponentCreator('/docs/home/food-security', '05f'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/home/innovations',
                component: ComponentCreator('/docs/home/innovations', '4fa'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/home/related-work',
                component: ComponentCreator('/docs/home/related-work', '3cc'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/home/serious-gardeners',
                component: ComponentCreator('/docs/home/serious-gardeners', 'e3e'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/home/sneak-peek',
                component: ComponentCreator('/docs/home/sneak-peek', 'e8b'),
                exact: true
              },
              {
                path: '/docs/home/team',
                component: ComponentCreator('/docs/home/team', '322'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/home/welcome',
                component: ComponentCreator('/docs/home/welcome', 'e24'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/adding-plantings',
                component: ComponentCreator('/docs/user-guide/adding-plantings', '36e'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/adding-vendors-crops-varieties',
                component: ComponentCreator('/docs/user-guide/adding-vendors-crops-varieties', '949'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/badges',
                component: ComponentCreator('/docs/user-guide/badges', 'e10'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/chat-rooms',
                component: ComponentCreator('/docs/user-guide/chat-rooms', '655'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/define-a-garden',
                component: ComponentCreator('/docs/user-guide/define-a-garden', 'e94'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/downloading',
                component: ComponentCreator('/docs/user-guide/downloading', '791'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/explore-a-chapter',
                component: ComponentCreator('/docs/user-guide/explore-a-chapter', '271'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/explore-a-garden',
                component: ComponentCreator('/docs/user-guide/explore-a-garden', 'ed5'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/geobot',
                component: ComponentCreator('/docs/user-guide/geobot', '9e0'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/guided-tour',
                component: ComponentCreator('/docs/user-guide/guided-tour', 'cc9'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/observations',
                component: ComponentCreator('/docs/user-guide/observations', 'dfc'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/outcomes',
                component: ComponentCreator('/docs/user-guide/outcomes', 'd0c'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/overview',
                component: ComponentCreator('/docs/user-guide/overview', 'b62'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/privacy',
                component: ComponentCreator('/docs/user-guide/privacy', 'f6a'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/registration',
                component: ComponentCreator('/docs/user-guide/registration', '0ae'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/scenarios',
                component: ComponentCreator('/docs/user-guide/scenarios', '5f9'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/seeds',
                component: ComponentCreator('/docs/user-guide/seeds', '5ba'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/tasks',
                component: ComponentCreator('/docs/user-guide/tasks', '7c3'),
                exact: true,
                sidebar: "homeSidebar"
              },
              {
                path: '/docs/user-guide/terms-and-conditions',
                component: ComponentCreator('/docs/user-guide/terms-and-conditions', 'bed'),
                exact: true,
                sidebar: "homeSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
