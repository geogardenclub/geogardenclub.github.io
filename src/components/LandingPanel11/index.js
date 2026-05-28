import React from 'react';

export default function LandingPanel11() {
  return (
      <div className='hero' style={{backgroundColor: "#e3ddc2"}}>
      <div className="container">
        <div className="row" style={{paddingBottom: '32px'}}>
            <div className='col'>
                <div className="container">
                    <h1 className="hero__title text--center">Connect with us</h1>
                    <p className="hero__subtitle text--left">Learn about the latest GeoGardenClub features, events, and tips.</p>
                </div>
            </div>
        </div>
          <div className="row">
              <div className='col'>
                  <div className="text--center">
                      <a href="https://www.instagram.com/geogardenclub/"><img width="20%" style={{paddingBottom: '20px'}} src="/instagram/instagram.png"/></a>
                  </div>
              </div>
              <div className='col'>
                  <div className="text--center">
                      <a href="https://www.facebook.com/geogardenclub"><img width="20%" style={{paddingBottom: '20px'}} src="facebook/facebook.png"/></a>
                  </div>
              </div>
              <div className='col'>
                  <div className="text--center">
                      <a href="https://www.youtube.com/@geogardenclub"><img width="20%" style={{paddingBottom: '20px'}} src="youtube/youtube.png"/></a>
                  </div>
              </div>
              <div className='col'>
                  <div className="text--center">
                      <div className="hero__title">
                      <a href="https://geogardenclub.us10.list-manage.com/subscribe?u=2c9db5ab59b4602f6c71e2091&id=c75bee0e1e"><img width="20%" style={{paddingBottom: '20px'}} src="img/landing/mailing-list.png"/></a>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        </div>
  );
}
