import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function LandingPanelTwo() {
  return (
      <div className={clsx('hero hero--primary', styles.heroBanner)}>
    <section className={styles.features}>

      <div className="container">
        <div className="row">
            <div className={clsx('col')}>
                <div className="text--center">
            <h1 style={{fontSize: '64px'}}>Join your local chapter today!</h1>
                </div>
            </div>
        </div>
          <div className="row">
              <div className={clsx('col')}>
                  <div className="text--center">
                      <a href="https://apps.apple.com/us/app/geogardenclub/id6478464910?ign-itscg=30200&ign-itsct=apps_box_badge&mttnsubad=6478464910"><img height="200px" src="apple/black.svg"/></a>
                  </div>
              </div>
              <div className={clsx('col')}>
                  <div className="text--center">
                      <a href="https://play.google.com/store/apps/details?id=com.geogardenclub.ggc_app"><img height="200px" src="google/google.svg"/></a>
                  </div>
              </div>
          </div>
          <div className="row">
              <div className={clsx('col')}>
                  <div className="text--center">
              <h1 style={{fontSize: '32px'}}>For a limited time, get the first six months free, then $4.99/month</h1>
                  </div>
              </div>
          </div>

        </div>
    </section>
        </div>
  );
}
