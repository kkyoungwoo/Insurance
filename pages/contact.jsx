import React from "react";
import HeaderNormal from "../components/header/HeaderNormal";
import TitleSection from "../components/heading/TitleSection";
import Layout from "../layout/Layout";

import Map from "../components/Map/Map";
import DsnGrid from "../layout/DsnGrid";
import InfoBox from "../components/contact/InfoBox";
import ContactForm from "../components/contact/ContactForm";
import Footer from "../components/footer/Footer";
import Head from "next/head";

function About() {
    TitleSection.defaultProps = {
        classDesc: "line-shape line-shape-before",
        classDesInner: "line-bg-right",
    };

    return (
        <Layout>
            <Head>
                <title>영업 문의하기 | WORK VISA</title>
            </Head>
            {/*========== Header Normal ========== */}
            <HeaderNormal className="text-center">
                <p className="subtitle p-relative line-shape  mb-20">
                    <span className="pl-10 pr-10 background-section">WORK VISA COMPANY</span>
                </p>
                <h1 className="title text-uppercase">
                    지금 합류하세요
                </h1>
                <p className="dsn-heading-title mt-15 max-w570">워크비자는 지금 이 시간에도 달려가고 있습니다
                </p>
            </HeaderNormal>
            {/*========== End Header Normal ==========*/}
            {/*Start Map*/}
            <Map
                mapKey="AIzaSyDMyAS2jdzj-vdgBIFaIStYOWJtSlghndg"
                zoom={10}
                height="50vh"
                defaultCenter={{lat: 35.917793, lng: 128.504683}}
            />

            {/*Start Contact Form && Info Box*/}
            <div className="section-margin container">
                <DsnGrid col={2} colTablet={1}>
                    <ContactForm/>
                    <InfoBox className="align-self-center"/>
                </DsnGrid>
            </div>

            {/*========== Footer ==========*/}
            <Footer className="background-section"/>
            {/*========== End Footer ==========*/}
        </Layout>
    );
}

export default About;
