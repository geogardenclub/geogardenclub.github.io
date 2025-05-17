import React from 'react';
import Button from '@site/src/components/Button';
import ReactPlayer from "react-player/youtube";

export default function LandingPanel10() {
    return (
        <div className="hero hero--primary">
            <div className="row row--no-gutters">
                <div className="col">
                    <div className="text--center">
                        <div className='wrapper'>
                            <ReactPlayer className='player' url="https://www.youtube.com/watch?v=jjgKgygZyUk" width="100%" height="100%" ></ReactPlayer>
                        </div>
                    </div>
                </div>
                <div className="col" style={{paddingLeft: '100px', alignItems: 'center', display: 'flex'}}>
                    <div className="text--center">
                        <h1 className="hero__title">Watch this to learn how GeoGardenClub helps you grow and share your harvest</h1>
                        <h1 className="hero__subtitle">Or check out our user guide for comprehensive information about the app.  </h1>
                        <Button style={{marginBottom: '2em', marginTop: '1em'}} size='lg' variant="success" label="User Guide"
                                link="/docs/user-guide/overview"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
