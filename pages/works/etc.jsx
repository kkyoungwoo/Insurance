import BoxGallery, { BoxGalleryItem } from "../../components/box-gallery/BoxGallery";
import ButtonProject from "../../components/button/ButtonProject";
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
  // "etc" 항목이 없으면 빈 객체를, "free_headhunting" 항목이 없으면 기본 slug를 적용하여 안전하게 처리
  const heroData = getPortfolioItem("etc") || {};
  const freeHeadhuntingData = getPortfolioItem("free_headhunting") || { slug: "/" };

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
                <strong>업무</strong> 기타 영업
              </li>
              <li className="p-relative">
                <strong>수수료</strong> 고정급 및 건별 수수료
              </li>
              <li className="p-relative">
                <strong>급여일</strong> 익월 10일
              </li>
            </ul>
          </div>
          <div className="intro-project-right">
            <h4 className="title-block text-uppercase mb-20">step</h4>
            <p className="intro-project-description">
              업무절차는 아래와 같습니다
            </p>
            <div className="intro-project-cat mt-30">
              <span className="cat-item">영업툴 숙지</span>
              <span className="cat-item">영업</span>
              <span className="cat-item">영업 정보 전달</span>
              <span className="cat-item">급여 수령</span>
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
            영업 프로세스는 오프라인 교육을 통해 안내됩니다
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
            외국인과 국내 사업장을 대상으로한 영업 인프라 제공
          </h4>
        </div>
      </section>
      {/* End Intro Project */}

      {/* Start Box Info Move Content */}
      <div className="p-relative section-margin v-light">
        <ParallaxImage src="/img/work/etc.jpg" overlay={2} alt="" />
        <MoveBox>
          <TitleSection className="align-items-start mb-30" defaultSpace={false}>
            장기 근속자만 인프라 제공
          </TitleSection>

          <p className="mb-10">기본급 + α 수익</p>
          <p className="mb-10">
            다양한 수익 인프라 및 관리자 권한 부여
          </p>
        </MoveBox>
      </div>
      {/* End Box Info Move Content */}

      {/* ========== Start Next Page Section ========== */}
      <NextPage className="background-section section-padding" />
      {/* ========== End Next Page Section ========== */}

      <NextProject heroContent={freeHeadhuntingData} number={1} />
    </Layout>
  );
}

export default Project3;
