import React from 'react';
import Card from '@site/src/components/Card';
import CardBody from '@site/src/components/Card/CardBody';
import CardFooter from '@site/src/components/Card/CardFooter';
import CardHeader from '@site/src/components/Card/CardHeader';
import CardImage from '@site/src/components/Card/CardImage';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from '@theme/Layout';
import Columns from '@site/src/components/Columns';
import Column from '@site/src/components/Column';

export default function TestPage() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout>
        <Card shadow='tl'>
            <CardHeader>
                <h3>Lorem Ipsum</h3>
            </CardHeader>
            <CardBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
            </CardBody>
            <CardFooter>
                <button className='button button--secondary button--block'>See All</button>
            </CardFooter>
        </Card>

            <Columns>
                <Column className='text--left'>
                    #### My First Column
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A diam maecenas sed enim ut. Sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Sit amet porttitor eget dolor morbi. Varius vel pharetra vel turpis nunc.
                </Column>
                <Column className='text--center'>
                    #### My Second Column
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A diam maecenas sed enim ut. Sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Sit amet porttitor eget dolor morbi. Varius vel pharetra vel turpis nunc.
                </Column>
                <Column className='text--justify'>
                    #### My Third Column
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A diam maecenas sed enim ut. Sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Sit amet porttitor eget dolor morbi. Varius vel pharetra vel turpis nunc.
                </Column>
            </Columns>
        </Layout>);
}