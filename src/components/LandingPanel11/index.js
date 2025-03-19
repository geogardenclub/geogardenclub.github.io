import React from 'react';

export default function LandingPanel11() {
  return (
      <div className='hero'>
      <div className="container">
        <div className="row" style={{paddingBottom: '32px'}}>
            <div className='col'>
                <div className="text--center">
                    <h1 className="hero__title">Connect with us!</h1>
                    <h1 className="hero__subtitle">Be the first to learn about new features, events, and get tips on utilizing GeoGardenClub to its fullest.</h1>
                </div>
            </div>
        </div>
          <div className="row">
              <div className='col'>
                  <div className="text--center">
                      <a href="https://www.instagram.com/geogardenclub/"><img height="150px" style={{paddingBottom: '20px'}} src="/instagram/instagram.png"/></a>
                  </div>
              </div>
              <div className='col'>
                  <div className="text--center">
                      <a href="https://www.facebook.com/geogardenclub"><img height="150px" style={{paddingBottom: '20px'}} src="facebook/facebook.png"/></a>
                  </div>
              </div>
              <div className='col'>
                  <div className="text--center">
                      <div className="hero__title">
                      <a href="https://geogardenclub.us10.list-manage.com/subscribe?u=2c9db5ab59b4602f6c71e2091&id=c75bee0e1e"><img height="150px" style={{paddingBottom: '20px'}} src="img/landing/mailing-list.png"/></a>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        </div>
  );
}
