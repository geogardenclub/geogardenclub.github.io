import React from 'react';
import Button from '@site/src/components/Button';
import styles from './styles.module.css';


export default function LandingPanel1() {
  return (
      <div className='hero hero--primary' style={{backgroundImage: `url('/img/landing/mesclun.jpeg')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'}}>
      <div className="container">
        <div className="row">
            <div className='col' style={{alignItems: 'center', display: 'flex'}}>
                <div className='text--center padding-horiz--md' >
                    <h1 className={styles.outline} style={{fontSize: '84px', color: 'white'}}>Grow and share more food.</h1>
                    <Button style={{marginBottom: '2em'}} size='lg' variant="success" label="Get Started" link="/docs/user-guide/get-started/overview" />
                </div>
            </div>
            <div className='col'>
                <div className="text--center">
                    <img height="375px" src="img/landing/seal1.png"/>
                </div>
            </div>
        </div>
      </div>
      </div>
  );
}
