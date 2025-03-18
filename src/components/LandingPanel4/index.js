import React from 'react';

export default function LandingPanel4() {
  return (
      <div className='hero hero--primary'>
      <div className="container">
        <div className="row" style={{paddingBottom: '32px'}}>
            <div className='col'>
                <div className="text--center">
                    <h1 className="hero__title">Here's what members are saying:</h1>
                </div>
            </div>
        </div>
          <div className="row">
              <div className='col'>
                  <div className="card" style={{marginBottom: '1em'}}>
                      <div className="card__body text--primary">
                          <p>
                              “I like being able to see what others have planted and when they planted it.”
                          </p>
                          <p>P.B., Whatcom-WA Chapter</p>
                      </div>
                  </div>
              </div>
              <div className='col'>
                  <div className="card" style={{marginBottom: '1em'}}>
                      <div className="card__body text--primary">
                          <p>
                              “I'm paying more attention to outcomes and dates... I'm realizing that I need to learn how to adapt to this cooler, shorter season.”
                          </p>
                          <p>P.B., Whatcom-WA Chapter</p>
                      </div>
                  </div>
              </div>
              <div className='col'>
                  <div className="card" style={{marginBottom: '1em'}}>
                      <div className="card__body text--primary">
                          <p>
                              “I think it's reduced my frantic chaos planning that tends to happen.”
                          </p>
                          <p>M.V., Whatcom-WA Chapter</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        </div>
  );
}
