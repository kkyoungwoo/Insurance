import React from "react";
import HeaderNormal from "../components/header/HeaderNormal";
import Layout from "../layout/Layout";
import Portfolio from "../components/portfolio/Portfolio";
import ModalContact from "../components/model-right/ModalContact";
import Footer from "../components/footer/Footer";
import Head from "next/head";


function Work() {


    return (
        <Layout modelRight={{children: <ModalContact/>, propsModal: {textBtn: "Contact"}}}>
            <Head>
                <title>영업 인프라 | WORK VISA</title>
            </Head>

        {/*========== Header Normal ========== */}
            <HeaderNormal backgroundColor="background-section" className="text-center">
                <p className="subtitle p-relative line-shape  dsn-load-animate">
                    <span className="pl-10 pr-10 background-main">영업 인프라</span>
                </p>
                <h1 className="title text-uppercase">
                    OUR WORKS
                </h1>
            </HeaderNormal>
            {/*========== End Header Normal ==========*/}

            <div className="container section-margin">
                <Portfolio stylePortfolio={"work-section"}
                            className="title-inherit h4"
                           useFilter

                           col={3} colGap={50} rowGap={80}
                />
            </div>
            {/*========== Footer ==========*/}
            <Footer className="background-section"/>
            {/*========== End Footer ==========*/}
        </Layout>
    );
}

export default Work;
