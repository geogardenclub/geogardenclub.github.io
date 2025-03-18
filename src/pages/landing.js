import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import React from "react";
import LandingPanel1 from '@site/src/components/LandingPanel1';
import LandingPanel2 from '@site/src/components/LandingPanel2';
import LandingPanel3 from '@site/src/components/LandingPanel3';
import LandingPanel4 from '@site/src/components/LandingPanel4';
import LandingPanel5 from '@site/src/components/LandingPanel5';
import LandingPanel6 from '@site/src/components/LandingPanel6';
import LandingPanel7 from '@site/src/components/LandingPanel7';
import LandingPanel8 from '@site/src/components/LandingPanel8';


export default function Landing() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout>
            <LandingPanel1 />
            <LandingPanel2 />
            <LandingPanel3 />
            <LandingPanel4 />
            <LandingPanel5 />
            <LandingPanel6 />
            <LandingPanel7 />
            <LandingPanel8 />
        </Layout>
    );
}