import React from 'react';

export default function LandingPanel7() {
    return (
        <div className="hero">
            <div className="row row--no-gutters">
                <div className="col" style={{alignItems: 'center', display: 'flex'}}>
                        <div className="text--center">
                            <h1 className="hero__title">Harvest More.</h1>
                            <h1 className="hero__subtitle">Record observations and yields to track success of each planting and improve your garden next year.</h1>
                    </div>
                </div>
                <div className="col">
                    <div className="text--center">
                    <img height="450px" src="img/landing/observation-screen.png"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
