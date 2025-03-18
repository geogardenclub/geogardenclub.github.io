import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Button from '@site/src/components/Button';

export default function LandingPanelThree() {
  return (
      <div style={{backgroundColor: '#e3ddc2'}}>
    <section className={styles.features}>

        <div className={clsx('col')}>
            <div className={clsx('text--center padding-horiz--md')} >
                <h1 style={{fontSize: '64px', color: '#02695c'}}>New to GeoGardenClub?</h1>
                <Button style={{marginBottom: '2em'}} size='lg' variant="success" label="Get Started" link="/docs/user-guide/get-started/overview" />
            </div>
        </div>

        <div height="300px">
            <img width="50%" src="img/landing/overshoulder.jpg"/>
        </div>

    </section>
        </div>
  );
}
