import React from 'react';
import Button from '@site/src/components/Button';

export default function LandingPanel3() {
    return (
        <div style={{backgroundColor: "#e3ddc2"}}>
            <div className="row" style={{backgroundColor: "#e3ddc2"}}>
                <div className="col">
                    <div className="hero" style={{backgroundColor: "#e3ddc2"}}>
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
    </div>
    );
}
