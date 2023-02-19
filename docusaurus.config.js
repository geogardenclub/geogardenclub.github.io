// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Geo Garden Club',
  tagline: 'Growing better gardens, gardeners, and communities, one plant at a time',
  favicon: 'img/favicon.ico',
  url: 'https://geogardenclub.github.io',
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
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/ggc-social-card.jpg',
      navbar: {
        title: 'Geo Garden Club',
        logo: { alt: 'Geo Garden Club', src: 'img/peony.png' },
        items: [
          {
            to: 'docs/motivation',
            activeBasePath: 'docs',
            label: 'Why GGC?',
            position: 'right',
          },
          {
            type: 'dropdown',
            label: 'Public Gardens',
            position: 'right',
            items: [
              {
                label: '45ght3cf',
                href: 'https://agilegardenclub.com/public-garden/?name=45ght3cf',
              },
              {
                label: '67abh39db',
                href: 'https://agilegardenclub.com/public-garden/?name=67abh39db',
              },
            ],
          },
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
      },
    }),
};

module.exports = config;
