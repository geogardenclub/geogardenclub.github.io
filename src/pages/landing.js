import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from 'clsx';
import Button from '@site/src/components/Button';
import React from "react";
import LandingPanelOne from '@site/src/components/LandingPanelOne';
import LandingPanelTwo from '@site/src/components/LandingPanelTwo';
import styles from './landing.module.css';


export default function Landing() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout>
            <LandingPanelOne />
            <LandingPanelTwo />
        </Layout>
    );
}