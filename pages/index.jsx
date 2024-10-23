import React from "react";
import Layout from "../layout/Layout";
import SliderPortfolio from "../components/slider-portfolio/SliderPortfolio";
import HeroSection from "../components/hero-section/HeroSection";
import TitleSection from "../components/heading/TitleSection";
import ServiceOne from "../components/services/grid/ServiceOne";
import ParallaxImage from "../components/Image/ParallaxImage";
import MoveBox from "../components/move-box/MoveBox";
import Button from "../components/button/Button";
import PortfolioSwiper from "../components/portfolio/PortfolioSwiper";
import SwiperPagination from "../components/swiper-pagination/SwiperPagination";
import Testimonial from "../components/testimonial/Testimonial";

import NextPage from "../components/next/NextPage";
import Footer from "../components/footer/Footer";
import ModalContact from "../components/model-right/ModalContact";
import Head from "next/head";


function Home() {
    TitleSection.defaultProps = {
        classDesc: "line-shape line-shape-before",
        classDesInner: "line-bg-right",
    };


    return (
        <Layout modelRight={{children: <ModalContact/>, propsModal: {textBtn: "Contact"}}}>
            <Head>
                <title>영업크루 모집 | WORK VISA</title>
            </Head>
            <SliderPortfolio
                webgel
                fullWidth
                className={"align-items-end pb-80"}
                webgelOptions={{
                    displacement: "/img/displacement/8.jpg",
                    speedIn: 1,
                }}
                metaData={{hasSeparator: true}}
            />
            <HeroSection className="container section-margin container fill-right-container"
                         data-dsn-title="How We Are"/>

            {/*Start Service*/}
            <div className="container section-margin" data-dsn-title="problem solver">
                <TitleSection
                    className="align-items-center text-center"
                    description={"- problem solver"}
                >고객의 니즈와 <br/> 워크비자 솔루션
                </TitleSection>
                <ServiceOne/>
            </div>
            {/*End Service*/}

            {/*Start Box Info Move Content*/}
            <div className="p-relative section-margin" data-dsn-title="ALL commission">
                <ParallaxImage src="/img/about-center.jpg" overlay={1} alt={""}/>
                <MoveBox tablet={false}>
                    <TitleSection
                        className={`align-items-start mb-30`}
                        description={"Highest Commission Offered"}
                        defaultSpace={false}
                    >
                        처음 하게되는 일은?
                    </TitleSection>

                    <p className="mb-10">
                        외국인 인재풀 제공 영업을 진행합니다
                    </p>
                    <p className=" mb-30">
                        하루 한건만 해도 90,000원의 월 고정 수익이 발생됩니다
                    </p>

                    <Button href={"https://workvisa.co.kr"} target="_blank" rel="noopener noreferrer">
                        외국인 구인구직 플랫폼 <span>⟶</span>
                    </Button>

                    <p className={`sm-p mt-15 theme-color`}>
                        ↑ 영업 대상 홈페이지
                    </p>
                </MoveBox>
            </div>
            {/*End Box Info Move Content*/}


            {/*Start Portfolio*/}
            <div className="section-margin" data-dsn-title="commission List">
                <TitleSection
                    className={`container align-items-center text-center`}
                    description={"commission List"}
                >
                    영업 인프라 제공 가능<br/>
                </TitleSection>
                <PortfolioSwiper
                    grabCursor
                    desktop={{spaceBetween: 50, slidesPerView: 1.5}}
                    tablet={{spaceBetween: 0, slidesPerView: 1.3}}
                    mobile={{slidesPerView: 1}}
                    stylePortfolio="work-section"
                    className="text-left v-dark-head title-inherit h4"
                    centeredSlides
                    loop
                    blur
                    parallax
                    speed={1200}
                    watchSlidesProgress
                    loopedSlides={2}
                    parallaxImage={{"data-swiper-parallax-scale": "0.85"}}
                    parallaxContent={{"data-swiper-parallax-opacity": "0"}}
                >
                    <SwiperPagination
                        className={`justify-content-between dsn-container mt-30`}
                    />
                </PortfolioSwiper>
            </div>
            {/*End Portfolio*/}

            {/*Start testimonial Section*/}
            <div className="section-margin" data-dsn-title="Company history">
                <Testimonial className="container section-margin" title="Company history"
                             skin={["Company history"]}
                             backgroundColor={"background-section"}
                             desktop={{slidesPerView: 2}}
                             mobile={{slidesPerView: 1}}
                             speed={1000} grabCursor loop loopedSlides={2}
                             parallax parallaxImage={{"data-swiper-parallax-scale": 0.7}}
                             parallaxContent={{"data-swiper-parallax-opacity": 0, "data-swiper-parallax": "30%"}}
                >
                    <SwiperPagination className={`justify-content-between dsn-container mt-30`}/>
                </Testimonial>
            </div>

            {/*========== Next Page ==========*/}
            <NextPage className="section-padding border-top background-section"/>
            {/*========== End Next Page ==========*/}

            {/*========== Footer ==========*/}
            <Footer className="background-section"/>
            {/*========== End Footer ==========*/}
        </Layout>
    );
}

export default Home;
