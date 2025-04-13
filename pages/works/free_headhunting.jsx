import ParallaxImage from "../../components/Image/ParallaxImage";
import DsnGrid from "../../layout/DsnGrid";
import Layout from "../../layout/Layout";
import NextProject from "../../components/next/NextProject";
import { getPortfolioItem } from "../../data/portfolio";
import HeaderFull from "../../components/header/HeaderFull";
import Image from "next/image";
import NextPage from "../../components/next/NextPage";
import MoveBox from "../../components/move-box/MoveBox";
import TitleSection from "../../components/heading/TitleSection";
import TitleCover from "../../components/heading/TitleCover";
import Button from "../../components/button/Button";

function Project3(params) {
  // "free_headhunting" 항목이 없으면 빈 객체를 사용합니다.
  const heroData = getPortfolioItem("free_headhunting") || {};
  // "paid_headhunting" 항목이 없으면 기본 slug 값을 가진 객체를 사용합니다.
  const paidHeadhuntingData = getPortfolioItem("paid_headhunting") || { slug: "/" };

  return (
    <Layout>
      <HeaderFull
        className="dsn-container"
        alignItems="end"
        heroContent={heroData}
        overlay={heroData?.overlay || 0} // overlay 값이 없으면 기본값 0 적용
      />

      {/* Start Intro Project */}
      <section className="intro-project container section-margin">
        <DsnGrid customGrid={{ desktop: "40% 60%" }}>
          <div className="intro-project-left">
            <h4 className="title-block text-uppercase mb-20">info</h4>
            <ul className="intro-project-list">
              <li className="p-relative">
                <strong>업무</strong> 외국인 합법취업을 필요로하는 회사와와 미팅
              </li>
            </ul>
          </div>
          <div className="intro-project-right">
            <h4 className="title-block text-uppercase mb-20">step</h4>
            <p className="intro-project-description">
              업무절차는 아래와 같습니다
            </p>
            <div className="intro-project-cat mt-30">
              <span className="cat-item">회사 미팅</span>
              <span className="cat-item">회사 구인요청서 확보</span>
              <span className="cat-item">
                워크비자에 구인요청서 이메일로 서류 전달
              </span>
            </div>
          </div>
          <div className="intro-project-right">
  <h4 className="title-block text-uppercase mb-20">워크비자의 장점</h4>
  
  <div className="intro-project-section mb-30">
    <h5 className="">빠른 외국인 채용</h5>
    <p className="intro-project-description">
      코로나 시기(2023년)에는 고용노동부를 통한 외국인 고용이 2년 이상 기다리는 등 
      기약 없는 대기 시간이 발생했습니다. 워크비자는 보다 신속한 채용이 가능합니다.
    </p>
  </div>

  <div className="intro-project-section mb-30">
    <h5 className="">경쟁사 비교</h5>
    <p className="intro-project-description">
      경쟁사는 <strong>Klik</strong>, <strong>Komate</strong>, <strong>114114</strong> 등이 있습니다.
      <strong>워크비자는 단순 인력 매칭도 가능</strong>하여 보다 폭넓은 채용이 가능합니다.
    </p>
  </div>

  <div className="intro-project-section mb-30">
    <h5 className="">맞춤형 채용 컨설팅</h5>
    <p className="intro-project-description">
      기업 방문을 통해 회사의 업종, 업태, 담당 업무, 한국인 인원수 등에 따라 외국인 채용 가능 여부를 
      정확히 확인할 수 있습니다.<br />
      고용 요청서를 작성하면 <strong>전문 상담사가 무료로 채용 가능 여부를 검토</strong>하고 외국인 고용을 도와드립니다.
    </p>
  </div>

  <div className="intro-project-section mb-30">
    <h5 className="">프리미엄 맞춤형 이력서 서비스</h5>
    <p className="intro-project-description">
      유료 서비스로 맞춤형 외국인 이력서 전달 서비스도 제공됩니다.<br />
      대기 인원이 많으므로 <strong>미리 예약해 두시는 것이 유리</strong>합니다.<br />
      <span className="price-info">
        구매 시 <strong>1인당 15만원</strong>이 발생됩니다.
      </span>
    </p>
  </div>

  <div className="intro-project-highlight">
    <p className="highlight-text">
      <strong>⚠️ 필수: </strong> DB활용시 1차로 구인 요청서는 반드시 받아야 합니다.
    </p>
  </div>
</div>

        </DsnGrid>
      </section>
      {/* End Intro Project */}

      <div className="p-relative pt-lg-section">
        <div className="box-info h-100 box-padding background-section">
          <TitleCover>speaker</TitleCover>
          <TitleSection className="text-uppercase mb-30" defaultSpace={false}>
            상세히 알고 싶으신가요?
          </TitleSection>
          <p className="mt-15">
          상세한 내용을 상담을 통해 안내됩니다
          </p>
          {/* <Button href="https://naver.com" className="mt-30">
              View More <span className="icon">⟶</span>
          </Button> */}
        </div>
      </div>

      {/* Start Intro Project */}
      <section className="container section-margin text-center">
        <div className="p-relative">
          <h4 className="title-block dsn-text max-w570 ml-auto mr-auto mb-70 sm-mb-30">
            외국인이 필요한 사업장에서 미팅을 진행하는 업무
          </h4>
        </div>
      </section>
      {/* End Intro Project */}

      {/* Start Box Info Move Content */}
      <div className="p-relative section-margin v-light">
        <ParallaxImage src="/img/work/free_headhunting.jpg" overlay={2} alt="" />
        <MoveBox>
          <TitleSection className="align-items-start mb-30" defaultSpace={false}>
            DB이용시 업무 요약
          </TitleSection>
          <p className="mb-10">1. 외국인 합법취업 가능성 확인안내 미팅</p>
          <p className="mb-10">2. 구인요청서를 워크비자 이메일로 전달</p>
          <p className="mb-10">email : workvisahr@naver.com</p>
        </MoveBox>
      </div>
      {/* End Box Info Move Content */}

      {/* ========== Start Next Page Section ========== */}
      <NextPage className="background-section section-padding" />
      {/* ========== End Next Page Section ========== */}

      <NextProject heroContent={paidHeadhuntingData} number={2} />
    </Layout>
  );
}

export default Project3;
