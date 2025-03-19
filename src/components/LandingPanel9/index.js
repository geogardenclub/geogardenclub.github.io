import React from 'react';
import Button from '@site/src/components/Button';

export default function LandingPanel9() {
    return (
        <div>
            <img width="100%" src="img/landing/garden-9.jpeg"/>
            <div className="row" style={{marginTop: '50px', marginBottom: '50px'}}>
                <div className="col" style={{alignItems: 'center', display: 'flex'}}>
                    <div className="text--center">
                        <h1 className="hero__title">Get growing with GeoGardenClub!</h1>
                    </div>
                </div>
                <div className="col" >
                    <div className="row">
                        <div className="col">
                        <div className="text--center">
                            <a href="https://apps.apple.com/us/app/geogardenclub/id6478464910?ign-itscg=30200&ign-itsct=apps_box_badge&mttnsubad=6478464910"><img height="100px" src="apple/black.svg"/></a>
                        </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        <div className="text--center">
                            <a href="https://play.google.com/store/apps/details?id=com.geogardenclub.ggc_app"><img height="100px" src="google/google.svg"/></a>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
