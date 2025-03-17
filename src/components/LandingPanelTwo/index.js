import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function LandingPanelTwo() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
            <div className={clsx('col')}>
                <div className={clsx('text--center padding-horiz--md')} >
                    <h1 style={{fontSize: '96px'}}>Grow and share more food.</h1>
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
  );
}
