// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

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
  onBrokenMarkdownLinks: 'warn',
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logos/png/wordmark.png',
      navbar: {
        title: 'Geo Garden Club',
        logo: { alt: 'Geo Garden Club', src: 'img/logos/png/icon2.png' },
        items: [
          {label: 'About', to: 'docs/home/welcome'},
          {label: 'User Guide', to: 'docs/user-guide/overview'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            label: 'Facebook',
            href: 'https://www.facebook.com/geogardenclub',
          },
          {
            label: 'Instagram',
            href: 'https://www.instagram.com/geogardenclub/',
          },
          {
            label: 'Join the GGC mailing list',
            href: 'https://geogardenclub.us10.list-manage.com/subscribe?u=2c9db5ab59b4602f6c71e2091&id=c75bee0e1e',
          },
          {
            label: 'News Archive',
            href: 'https://us10.campaign-archive.com/home/?u=2c9db5ab59b4602f6c71e2091&id=c75bee0e1e',
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
