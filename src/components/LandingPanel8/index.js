import React from 'react';
import Button from '@site/src/components/Button';

export default function LandingPanel8() {
    return (
        <div className="hero hero--primary">
            <div className="row row--no-gutters">
                <div className="col">
                    <div className="text--center">
                        <img height="450px" src="img/landing/share-screen.png"/>
                    </div>
                </div>
                <div className="col" style={{alignItems: 'center', display: 'flex'}}>
                    <div className="text--center">
                        <h1 className="hero__title">Waste Less.</h1>
                        <h1 className="hero__subtitle">Share and trade surplus seeds, harvests, tools, and materials with other local gardeners.  </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
