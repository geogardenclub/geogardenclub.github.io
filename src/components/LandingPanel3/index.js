import React from 'react';
import Button from '@site/src/components/Button';

export default function LandingPanel3() {
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
