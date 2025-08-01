import React from 'react';

export default function LandingPanel4() {
  return (
      <div className='hero hero--primary'>
      <div className="container">
        <div className="row" style={{paddingBottom: '32px'}}>
            <div className='col'>
                <div className="text--center">
                    <h1 className="hero__title">Here's what gardeners are saying:</h1>
                </div>
            </div>
        </div>
          <div className="row">
              <div className='col'>
                  <div className="card" style={{marginBottom: '1em'}}>
                      <div className="card__body text--primary">
                          <p>
                              “On advice from a friend I recently downloaded this app for my urban rooftop garden. I really enjoy its sleek design and wealth of functionalities..”
                          </p>
                          <p>W.J., Manhattan-NY Chapter</p>
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
                              “I have everything I need in one app for my garden - past and present. One can post photos for comparison’s sake, reminders of tasks to do, check boxes for completed chores and a community feature to connect with local gardeners. ”
                          </p>
                          <p>E.R., Whatcom-WA Chapter</p>
                      </div>
                  </div>
              </div>
              <div className='col'>
                  <div className="card" style={{marginBottom: '1em'}}>
                      <div className="card__body text--primary">
                          <p>
                              “I finally have a simple way to track the flowering and fruiting of my Mango tree from one season to the next.”
                          </p>
                          <p>P.J., Oahu-HI Chapter</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        </div>
  );
}
