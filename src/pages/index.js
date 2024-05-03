import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ReactPlayer from 'react-player/youtube'

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="text--center">
          <img height="350px" src={'/img/logos/png/seal1.png'} />
        </div>
        {/* <h1 className="hero__title">{siteConfig.title}</h1> */}
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        {/* <YouTube id="VqfuRmlm-yE"/> */}
      </div>
    </header>
  );
}

function HomepageFooter() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h3 className="hero__subtitle">Watch our 5 minute intro to GeoGardenClub</h3>
        <div className='wrapper'>
          <ReactPlayer className='player' url="https://www.youtube.com/watch?v=nQuRtGop7ig" width="100%" height="100%" ></ReactPlayer>
        </div>

      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Growing better gardens, gardeners, and communities, one plant at a time.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <HomepageFooter />
    </Layout>
  );
}
