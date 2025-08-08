import React from 'react';
import clsx from "clsx";

function FeaturedGardener({photo, name, chapter, quote, url}) {
    return (
        <div className="card" style={{marginBottom: '1em'}}>
            <div className="card__header">
                <div className="avatar">
                    <img
                        className="avatar__photo"
                        src={photo}/>
                    <div className="avatar__intro">
                        <div className="avatar__name text--primary">{name}</div>
                        <small className="avatar__subtitle text--primary">
                            {chapter}
                        </small>
                    </div>
                </div>
            </div>
            <div className="card__body text--primary">
                <p>
                    {quote}
                </p>
            </div>
            <div className="card__footer text--center">
                <a className="button button--primary" href={url}>Read more</a>
            </div>
        </div>
    );
}

export default function LandingPanel4a() {
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
                  <FeaturedGardener
                      chapter='Calaveras-CA Chapter'
                      name='Threse'
                      photo='img/featured-gardeners/threse.png'
                      quote="I love being able to look at other gardens all over the country! It's so cool to be able to share observations and learn from other gardeners!"
                      url='/docs/featured-gardeners/threse'>
                  </FeaturedGardener>
              </div>

              <div className='col'>
                  <FeaturedGardener
                      chapter='Whatcom-WA Chapter'
                      name='Jessie'
                      photo='img/featured-gardeners/jessie.jpeg'
                      quote="I really enjoy reading the observations and other people’s gardens. It informs me and gives me new ideas!"
                      url='/docs/featured-gardeners/jessie'>
                  </FeaturedGardener>
              </div>

              <div className='col'>
                  <FeaturedGardener
                      chapter='Whatcom-WA and Skagit-WA Chapters'
                      name='Margo'
                      photo='img/featured-gardeners/margo.jpeg'
                      quote="I like to use the filter function to find where I planned to plant certain crops rather than scrolling through all my beds to try and find where I put things. "
                      url='/docs/featured-gardeners/margo'>
                  </FeaturedGardener>
              </div>
          </div>
        </div>
        </div>
  );
}
