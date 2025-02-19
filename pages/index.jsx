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

// 기본 defaultProps 설정 (TitleSection 컴포넌트에 적용)
TitleSection.defaultProps = {
    classDesc: "line-shape line-shape-before",
    classDesInner: "line-bg-right",
};

function Home() {
    return (
        <Layout modelRight={{ children: <ModalContact />, propsModal: { textBtn: "Contact" } }}>
            <Head>
                <title>기업 DB 판매 | WORK VISA</title>
            </Head>
            {/* eslint-disable react/no-unescaped-entities */}
            <SliderPortfolio
                webgel
                fullWidth
                className={"align-items-end pb-80"}
                webgelOptions={{
                    displacement: "/img/displacement/8.jpg",
                    speedIn: 1,
                }}
                metaData={{ hasSeparator: true }}
            />
            <HeroSection
                className="container section-margin container fill-right-container"
                data-dsn-title="How We Are"
            />

            {/* Start Service */}
            <div className="container section-margin" data-dsn-title="problem solver">
                <TitleSection
                    className="align-items-center text-center"
                    description={"- problem solver"}
                >
                    대화에 주도권이 있습니다<br />
                </TitleSection>
                <ServiceOne />
            </div>
            {/* End Service */}

            {/* Start Box Info Move Content */}
            <div className="p-relative section-margin" data-dsn-title="ALL commission">
                <ParallaxImage src="/img/about-center.jpg" alt="About Center" />
                <MoveBox tablet={false}>
                    <TitleSection
                        className="align-items-start mb-30"
                        description={"How to Create and Use a DB"}
                        defaultSpace={false}
                    >
                        영업이 참 쉽습니다
                    </TitleSection>

                    <p className="mb-20">
                        1. 기업에 방문하여 "구인요청서"와 "사업자등록증"을 받기
                    </p>
                    <p>
                        2. 워크비자로 "구인요청서"와 "사업자등록증"을 이메일로 전달
                    </p>
                    <p className="mb-30">
                        email : workvisahr@naver.com
                    </p>
                    <p className="mb-30">
                        기업은 우리를 통해 무료로 외국인 합법취업 컨설팅, 유료로 외국인 이력서를 받을 수 있습니다.
                    </p>
                    <p className="mb-30">
                        영업에 집중하세요, 나머지는 저희가 해결하겠습니다
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            gap: "20px",
                            flexWrap: "wrap",
                            marginBottom: "30px",
                        }}
                    >
                        <Button
                            href="../구인요청서.hwp"
                            style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            구인요청서 HWP 다운로드
                        </Button>

                        <Button
                            href="../구인요청서.pdf"
                            style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                backgroundColor: "#007BFF",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            구인요청서 PDF 다운로드
                        </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
                        <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-lg">
                            <h2 style={{ fontSize: "20px", marginBottom: "10px" }} className="mb-4">
                                외국인 전문 상담 TM 샘플
                            </h2>
                            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-md">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube-nocookie.com/embed/w9hilORl76k?rel=0&modestbranding=1&autoplay=0&showinfo=0&controls=1"
                                    title="YouTube Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </MoveBox>
            </div>
            {/* End Box Info Move Content */}

            {/* Start Portfolio */}
            <div className="section-margin" data-dsn-title="commission List">
                <TitleSection
                    className="container align-items-center text-center"
                    description={"commission List"}
                >
                    영업 아이템 설명<br />
                </TitleSection>
                <PortfolioSwiper
                    grabCursor
                    desktop={{ spaceBetween: 50, slidesPerView: 1.5 }}
                    tablet={{ spaceBetween: 0, slidesPerView: 1.3 }}
                    mobile={{ slidesPerView: 1 }}
                    stylePortfolio="work-section"
                    className="text-left v-dark-head title-inherit h4"
                    centeredSlides
                    loop
                    blur
                    parallax
                    speed={1200}
                    watchSlidesProgress
                    loopedSlides={2}
                    parallaxImage={{ "data-swiper-parallax-scale": "0.85" }}
                    parallaxContent={{ "data-swiper-parallax-opacity": "0" }}
                >
                    <SwiperPagination className="justify-content-between dsn-container mt-30" />
                </PortfolioSwiper>
            </div>
            {/* End Portfolio */}

            {/* Start Testimonial Section */}
            <div className="section-margin" data-dsn-title="Company history">
                <Testimonial
                    className="container section-margin"
                    title="Company history"
                    skin={["Company history"]}
                    backgroundColor="background-section"
                    desktop={{ slidesPerView: 2 }}
                    mobile={{ slidesPerView: 1 }}
                    speed={1000}
                    grabCursor
                    loop
                    loopedSlides={2}
                    parallax
                    parallaxImage={{ "data-swiper-parallax-scale": 0.7 }}
                    parallaxContent={{ "data-swiper-parallax-opacity": 0, "data-swiper-parallax": "30%" }}
                >
                    <SwiperPagination className="justify-content-between dsn-container mt-30" />
                </Testimonial>
            </div>
            {/* End Testimonial Section */}

            {/* ========== Next Page ========== */}
            <NextPage className="section-padding border-top background-section" />
            {/* ========== End Next Page ========== */}r

            {/* ========== Footer ========== */}
            <Footer className="background-section" />
            {/* ========== End Footer ========== */}
            {/* eslint-enable react/no-unescaped-entities */}
        </Layout>
    );
}

export default Home;
