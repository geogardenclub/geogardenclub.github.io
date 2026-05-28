import React from 'react';
import Button from '@site/src/components/Button';
import ReactPlayer from "react-player/youtube";

export default function LandingPanel10() {
    return (
        <div className="hero hero--primary">
                <div className="col">
                    <div className="container">
                        <h1 className="hero__title text--center">Watch GeoGardenClub in action</h1>
                        <iframe src="https://www.youtube.com/embed/X6ke44oduOQ"
                                style={{width: "100%", aspectRatio: "16 / 9", height: "auto"}} frameBorder="0"
                                allowFullScreen></iframe>
                    </div>
                </div>
        </div>
    );
}
