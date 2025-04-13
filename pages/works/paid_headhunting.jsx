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
  // "paid_headhunting" 데이터가 없을 경우 빈 객체를 사용
  const heroData = getPortfolioItem("paid_headhunting") || {};
  // "remote_work" 데이터가 없으면 기본 slug를 가진 객체를 사용하여 URL 처리 오류 방지
  const remoteWorkData = getPortfolioItem("remote_work") || { slug: "/" };

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
                <strong>업무</strong> 외국인 합법취업이 가능한 회사에 맞춤형 이력서 전달
              </li>
            </ul>
          </div>
          <div className="intro-project-right">
            <h4 className="title-block text-uppercase mb-20">step</h4>
            <p className="intro-project-description">
              업무절차는 아래와 같습니다
            </p>
            <div className="intro-project-cat mt-30">
              <span className="cat-item">외국인 합법 고용 컨설팅 진행</span>
              <span className="cat-item">외국인 고용 희망 이메일 회신</span>
              <span className="cat-item">워크비자 본사에서 비자 컨설팅 및 외국인 이력서 전달</span>
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
        </div>
      </div>

      {/* Start Intro Project */}
      <section className="container section-margin text-center">
        <div className="p-relative">
          <h4 className="title-block dsn-text max-w570 ml-auto mr-auto mb-70 sm-mb-30">
            250여가지 비자를 고려한 기업에 맞춤형 이력서 전달 영업
          </h4>
        </div>
      </section>
      {/* End Intro Project */}

      {/* Start Box Info Move Content */}
      <div className="p-relative section-margin v-light">
        <ParallaxImage src="/img/work/paid_headhunting.jpg" overlay={2} alt="" />
        <MoveBox>
          <TitleSection className="align-items-start mb-30" defaultSpace={false}>
            외국인 이력서 무료열람 가능
          </TitleSection>
          <p className="mb-10">
            워크비자 채용 플랫폼에서 월 최대 30건 이력서 무료열람 가능
          </p>
        </MoveBox>
      </div>
      {/* End Box Info Move Content */}

      {/* ========== Start Next Page Section ========== */}
      <NextPage className="background-section section-padding" />
      {/* ========== End Next Page Section ========== */}

      <NextProject heroContent={remoteWorkData} number={3} />
    </Layout>
  );
}

export default Project3;
