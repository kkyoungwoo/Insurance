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
                <strong>업무</strong> 외국인 합법취업이 가능한 회사 미팅
              </li>
              <li className="p-relative">
                <strong>수수료</strong> 맞춤형 이력서 모집의 50% 수수료
              </li>
              <li className="p-relative">
                <strong>급여일</strong> 취업확정 후 익월 10일
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
              <span className="cat-item">회사 구인요청서, 사업자등록증 확보</span>
              <span className="cat-item">
                워크비자에 구인요청서, 사업자등록증 서류 전달
              </span>
              <span className="cat-item">취업 확정 후 수수료 지급</span>
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
        </div>
      </div>

      {/* Start Intro Project */}
      <section className="container section-margin text-center">
        <div className="p-relative">
          <h4 className="title-block dsn-text max-w570 ml-auto mr-auto mb-70 sm-mb-30">
            인구감소 지역 또는 고용허가서가 있는 기업에 맞춤형 이력서 전달 영업
          </h4>
        </div>
      </section>
      {/* End Intro Project */}

      {/* Start Box Info Move Content */}
      <div className="p-relative section-margin v-light">
        <ParallaxImage src="/img/work/paid_headhunting.jpg" overlay={2} alt="" />
        <MoveBox>
          <TitleSection className="align-items-start mb-30" defaultSpace={false}>
            1건당 45,000원 수익
          </TitleSection>
          <p className="mb-10">
            사업장은 건당 9만원의 이력서 확보 비용 발생
          </p>
          <p className="mb-10">최소 구매수량 5개</p>
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
