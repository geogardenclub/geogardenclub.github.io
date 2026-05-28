import React from 'react';

export default function LandingPanel7() {
    return (
        <div className="hero" style={{backgroundColor: "#e3ddc2"}}>
            <div className="row">
                <div className="col">
                        <div className="container">
                            <h1 className="hero__title text--center">Harvest More</h1>
                            <p className="hero__subtitle text--left">Record observations and yields to track success of each planting and improve your garden next year.</p>
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
