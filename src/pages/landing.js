import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import React from "react";
import LandingPanel1 from '@site/src/components/LandingPanel1';
import LandingPanel2 from '@site/src/components/LandingPanel2';
import LandingPanel3 from '@site/src/components/LandingPanel3';


export default function Landing() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout>
            <LandingPanel1 />
            <LandingPanel2 />
            <LandingPanel3 />
        </Layout>
    );
}