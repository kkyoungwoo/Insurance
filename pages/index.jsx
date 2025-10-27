import {useState} from "react";
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

    const [selectedVideo, setSelectedVideo] = useState("newVideo");
    

    const videos = [
        {
            id: "newVideo",
            title: "기업 TM 샘플",
            url: "https://www.youtube-nocookie.com/embed/s3Vmehabd7c?rel=0&modestbranding=1&autoplay=0&showinfo=0&controls=1"
        },
        {
            id: "consulting2",
            title: "프리랜서 TM 스크립트 (심화)",
            url: "https://www.youtube-nocookie.com/embed/_4Q7ToLbM8E?rel=0&modestbranding=1&autoplay=0&showinfo=0&controls=1"
        }
    ];
    
    
    return (
        <Layout modelRight={{ children: <ModalContact />, propsModal: { textBtn: "Contact" } }}>
            <Head>
                <title>보험DB 기업DB 자체 생산 | 법인영업디비 판매</title>
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
                    description={"DB영업 과정"}
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
                        description={"워크비자 DB는"}
                        defaultSpace={false}
                    >
                        영업이 당당합니다
                    </TitleSection>

                    <p className="mb-10">
                        1. 기업에게 무료 컨설팅 제공
                    </p>
                    <p className="mb-10">
                        2. 필요시 이력서 무료 전달
                    </p>
                    <p className="mb-20">
                        3. 100% 합법적인 절차로 진행 
                    </p>

                    <div
    style={{
        display: "flex",
        justifyContent: "center", // 모바일에서 중앙 정렬
        gap: "20px",
        flexWrap: "wrap", // 화면 크기에 따라 자동 줄바꿈
        marginBottom: "30px",
    }}
>
    <Button
        href="../구인요청서.zip"
        style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            textAlign: "center",
            whiteSpace: "nowrap",
            width: "100%", // 모바일에서 가득 차게
            maxWidth: "300px", // 버튼 최대 크기 설정
        }}
        target="_blank"
        rel="noopener noreferrer"
    >
        구인요청서 다운로드
    </Button>
</div>


                    
<div className="max-w-2xl w-full space-y-6">
<div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "30px",marginBottom:"30px" }}>
  <h2 className="text-white" style={{ fontSize: "25px", margin: 0 }}>🎬 참고</h2>
  <a
    href="../워크비자 TM 샘플파일.zip" // 실제 파일 경로로 변경 필요
    download
    style={{
      padding: "10px 20px",
      backgroundColor: "#2563eb",
      color: "white",
      borderRadius: "5px",
      textDecoration: "none",
      cursor: "pointer",
      transition: "background-color 0.3s",
      whiteSpace: "nowrap",
      fontWeight: 500
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
  >
    TM 녹음 파일 다운로드
  </a>
</div>
            <div className="relative">
    <select 
        style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '0.75rem',
            backgroundColor: '#2d3748', // Dark gray background
            color: 'white',
            border: '2px solid #4a5568', // Border color
            outline: 'none',
            transition: 'border-color 0.2s ease',
            fontSize: '1rem',
            fontWeight: '500',
            boxSizing: 'border-box'
        }}
        value={selectedVideo} 
        onChange={(e) => setSelectedVideo(e.target.value)}
    >
        {videos.map(video => (
            <option 
                key={video.id} 
                value={video.id} 
                style={{
                    backgroundColor: '#2d3748', // Option background
                    color: 'white',
                    padding: '0.75rem',
                    fontSize: '1rem'
                }}
            >
                {video.title}
            </option>
        ))}
    </select>
</div>


            {videos.map(video => (
                video.id === selectedVideo && (
                    <div key={video.id} className="bg-gray-800 p-8 rounded-2xl shadow-lg">
                        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-md" style={{marginTop:"30px"}}>
                            <iframe
                                className="w-full h-full"
                                src={video.url}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )
            ))}
        </div>
             </MoveBox>
            </div>
            {/* End Box Info Move Content */}

            {/* Start Portfolio */}
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
