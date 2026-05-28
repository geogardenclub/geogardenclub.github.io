import React from 'react';
import Button from '@site/src/components/Button';

export default function LandingPanel8() {
    return (
        <div className="hero hero--primary">
            <div className="row">
                <div className="col">
                    <div className="text--center">
                        <img height="450px" src="img/landing/forum.png"/>
                    </div>
                </div>
                <div className="col">
                    <div className="container">
                        <h1 className="hero__title text--center">Waste Less</h1>
                        <p className="hero__subtitle text--left">Share and trade surplus seeds, harvests, tools, and materials with other local gardeners.  </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
