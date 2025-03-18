import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Button from '@site/src/components/Button';
import Columns from '@site/src/components/Columns';
import Column from '@site/src/components/Column';

export function LandingPanelThreeOld() {
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

export default function LandingPanelThree() {
    return (
            <div className="row row--no-gutters">

                <div className="col">
                    <div className="hero">
                        <div className="container text--center">
                            <h1 className="hero__title">New to GeoGardenClub?</h1>

                            <div>
                                <Button style={{marginBottom: '2em', marginTop: '1em'}} size='lg' variant="success" label="Get Started"
                                        link="/docs/user-guide/get-started/overview"/>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col" style={{marginBottom: "-20px"}}>
                    <img src="img/landing/overshoulder4.jpg"/>
                </div>

            </div>
    );
}
