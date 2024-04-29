import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Unlock insights from your personal experience',
    png: '/img/landing/outcomes.png',
    description: (
      <>
        Home gardening over multiple seasons yields many useful insights. GGC provides new ways to gather and reflect on your home garden's history in order to improve your future gardening outcomes.
      </>
    ),
  },
  {
    title: 'Discover the collective wisdom of your community',
    png: '/img/landing/chapters.png',
    description: (
      <>
        GGC facilitates the creation and management of local "communities of practice" allowing members to come together and share best practices with each other.
      </>
    ),
  },
  {
    title: 'Improve local food production and practices',
    png: '/img/landing/home.png',
    description: (
      <>
        Home gardens are an important and underutilized resource for increasing community resilience, health, and emotional well-being. GGC provides new ways for gardeners to work together to improve local food production and practices.
      </>
    ),
  },
];

function Feature({png, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img height="500px" src={png} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
