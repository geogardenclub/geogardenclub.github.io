import React from 'react';

export default function LandingPanel5() {
    return (
        <div className="hero">
            <div className="row row--no-gutters">
                <div className="col" style={{alignItems: 'center', display: 'flex'}}>
                        <div className="text--center">
                            <h1 className="hero__title">Plan Better.</h1>
                            <h1 className="hero__subtitle">Copy plantings from previous seasons or other gardeners to quickly and efficiently plan out your garden.</h1>
                    </div>
                </div>
                <div className="col">
                    <div className="text--center">
                    <img height="450px" src="img/landing/timeline-screen.png"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
