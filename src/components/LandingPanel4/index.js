import React from 'react';

export default function LandingPanel4() {
  return (
      <div className='hero hero--primary'>
      <div className="container">
        <div className="row" style={{paddingBottom: '32px'}}>
            <div className='col'>
                <div className="text--center">
                    <h1 className="hero__title">Join your local chapter today!</h1>
                </div>
            </div>
        </div>
          <div className="row">
              <div className='col'>
                  <div className="text--center">
                      <a href="https://apps.apple.com/us/app/geogardenclub/id6478464910?ign-itscg=30200&ign-itsct=apps_box_badge&mttnsubad=6478464910"><img height="150px" src="apple/black.svg"/></a>
                  </div>
              </div>
              <div className='col'>
                  <div className="text--center">
                      <a href="https://play.google.com/store/apps/details?id=com.geogardenclub.ggc_app"><img height="150px" src="google/google.svg"/></a>
                  </div>
              </div>
          </div>
          <div className="row" style={{paddingTop: '32px'}}>
              <div className='col'>
                  <div className="text--center">
              <h1 className="hero__subtitle">For a limited time, get the first six months free, then $4.99/month</h1>
                  </div>
              </div>
          </div>
        </div>
        </div>
  );
}
