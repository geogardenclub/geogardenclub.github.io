import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Button from '@site/src/components/Button';


export default function LandingPanelOne() {
  return (
      <div className={clsx('hero hero--primary', styles.heroBanner)} style={{backgroundImage: `url('/img/landing/garden-1a.jpeg')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'}}>
    <section className={styles.features}>
      <div className="container">
        <div className="row">
            <div className={clsx('col')}>
                <div className={clsx('text--center padding-horiz--md')} >
                    <h1 style={{fontSize: '96px'}}>Grow and share more food.</h1>
                    <Button style={{marginBottom: '2em'}} size='lg' variant="success" label="Get Started" link="/docs/user-guide/get-started/overview" />
                </div>
            </div>
            <div className={clsx('col')}>
                <div className="text--center">
                    <img height="400px" src="img/landing/seal1.png"/>
                </div>
            </div>
        </div>
      </div>
    </section>
      </div>
  );
}
