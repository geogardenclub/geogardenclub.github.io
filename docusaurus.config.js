// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

//
// <a href="https://apps.apple.com/us/app/geogardenclub/id6478464910?itscg=30200&itsct=apps_box_badge&mttnsubad=6478464910"
//    style="display: inline-block;">
//   <img
//       src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/white/en-us?releaseDate=1736899200"
//       alt="Download on the App Store" style="width: 246px; height: 82px; vertical-align: middle; object-fit: contain;"/>
// </a>


const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Geo Garden Club',
  tagline: 'Improving community food resilience, one garden at a time.',
  favicon: 'img/favicon.ico',
  url: 'https://geogardenclub.com',
  baseUrl: '/',
  deploymentBranch: 'main',
  trailingSlash: false,
  organizationName: 'geogardenclub', // Usually your GitHub org/user name.
  projectName: 'geogardenclub.github.io', // Usually your repo name.
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'GeoGardenClub News',
          blogDescription: 'Information about GeoGardenClub App Releases, newsletter, news releases, and other garden planning information.',
          routeBasePath: 'news',
          blogSidebarCount: 20,
          onInlineAuthors: 'ignore',
          showReadingTime: false,
          onUntruncatedBlogPosts: 'ignore',
        },
        sitemap: {
          ignorePatterns: ['/docs/business-guide/**', '/docs/developer-guide/**', '/docs/admin-guide/**'],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-WMYL9625P3',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
      },
    },
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        image: 'img/logos/png/wordmark.png',
        metadata: [
          {name: 'keywords', content: 'Garden planning app, Garden design software, Vegetable garden planner, Online garden planner, Backyard garden planner, Organic garden planning, Community garden planner, Sustainable gardening app, Community food resiliency, Local planting guide app, Smart garden planner, Vegetable garden design tool, Interactive garden planner, Garden journal and tracker, Small garden design app'},
          {name: 'description', content: 'GeoGardenClub is an easy to use garden planning tool that allows local communities of gardeners to share information and improve their gardening skill.'},
          {name: 'algolia-site-verification', content: 'A6D58F21A54557ED'},
        ],
        colorMode: {
          defaultMode: 'light',
          disableSwitch: true,
          respectPrefersColorScheme: false,
        },
        algolia: {
          appId: 'RLT29EO5JS',
          apiKey: '93ef07f3c1d2084bfa306d35d4a783c5',
          indexName: 'GGC2',
          contextualSearch: true,
          // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
          // externalUrlRegex: 'external\\.com|domain\\.com',
          // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
          //replaceSearchResultPathname: {
          //  from: '/docs/', // or as RegExp: /\/docs\//
          // to: '/',
          //},
          // Optional: Algolia search parameters
          searchParameters: {},
          // Optional: path for search page that enabled by default (`false` to disable it)
          searchPagePath: false, // 'search',
          // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
          insights: false,
          // Optional: whether you want to use the new Ask AI feature (undefined by default)
          //askAi: 'YOUR_ALGOLIA_ASK_AI_ASSISTANT_ID',
        },
        navbar: {
          title: 'Geo Garden Club',
          logo: {alt: 'Geo Garden Club', src: 'img/logos/png/icon2.png'},
          items: [
            {label: 'Pricing', to: 'pricing'},
            {label: 'About', to: 'docs/user-guide/home/welcome'},
            {label: 'User Guide', to: 'docs/user-guide/overview'},
            {label: 'News', to: 'news'},
            {label: 'FAQ', to: 'docs/user-guide/faq'},
            {
              to: 'docs/user-guide/get-started/overview',
              label: 'Get Started',
              className: 'button button--outline button--primary button--md'
            },
            {
              type: 'html',
              position: 'right',
              value: '<a href="https://www.instagram.com/geogardenclub/" target="_blank" style="content: \'\'; width: 24px; height: 24px; background-image: url(\'/instagram/instagram.png\'); background-repeat: no-repeat;  background-size: 24px 24px; display: flex">'
            },
            {
              type: 'html',
              position: 'right',
              value: '<a href="https://www.facebook.com/geogardenclub" target="_blank" style="content: \'\'; width: 24px; height: 24px; background-image: url(\'/facebook/facebook.png\'); background-repeat: no-repeat;  background-size: 24px 24px; display: flex">'
            },
            {
              type: 'html',
              position: 'right',
              value: '<a href="https://youtube.com/@geogardenclub" target="_blank" style="content: \'\'; height: 24px; width: 36px; background-image: url(\'/youtube/youtube.png\'); background-repeat: no-repeat;  background-size: 36px 24px; display: flex">'
            },
          ],
        },
        footer: {
          style: 'dark',
          links: [
            {
              label: 'Terms and Conditions',
              href: '/docs/user-guide/terms-and-conditions',
            },
            {
              label: 'Privacy',
              href: '/docs/user-guide/privacy',
            },
            {
              label: 'Contact Us',
              href: '/docs/user-guide/home/contact-us',
            },

          ],
          copyright: `Copyright © ${new Date().getFullYear()} Geo Garden Club, LLC`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
          additionalLanguages: ['dart'],
        },
      }),
};

module.exports = config;
