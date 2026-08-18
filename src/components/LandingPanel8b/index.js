import React from 'react';
import styles from './styles.module.css';

export default function LandingPanel8b() {
    return (
        <div className="hero hero--primary">
            <div className="row">
                <div className="col">
                    <div className="text--center">
                        <div className={styles['image-container']}>
                            <img src="img/landing/seal1.png" alt="Base Image" className={styles['base-img']}/>
                            <svg opacity="0.7" className={styles['overlay-svg']} xmlns="http://w3.org" viewBox="0 0 24 24">
                                <path fill="red" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="container">
                        <h1 className="hero__title text--left">The #1 app for privacy-conscious gardeners</h1>
                        <p className="hero__subtitle text--left"><ul><li>No AI</li><li>No data selling</li><li>No location tracking</li><li>No advertisements</li><li>You own your content</li><li>100% member supported</li></ul></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
