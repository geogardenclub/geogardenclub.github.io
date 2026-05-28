import React from 'react';
import Button from '@site/src/components/Button';

export default function LandingPanel6() {
    return (
        <div className="hero hero--primary">
            <div className="row">
                <div className="col">
                    <div className="text--center">
                        <img height="450px" src="img/landing/tasks-screen.png"/>
                    </div>
                </div>
                <div className="col">
                    <div className="container text--center">
                        <h1 className="hero__title">Manage Easier</h1>
                        <p className="hero__subtitle text--left">Stay on track with our smart task list, keeping your plans automatically up to date.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
