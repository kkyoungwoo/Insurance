import BoxGallery, {
  BoxGalleryItem,
} from "../../components/box-gallery/BoxGallery";
import ButtonProject from "../../components/button/ButtonProject";
import ParallaxImage from "../../components/Image/ParallaxImage";
import DsnGrid from "../../layout/DsnGrid";
import Layout from "../../layout/Layout";
import NextProject from "../../components/next/NextProject";
import {getPortfolioItem} from "../../data/portfolio";
import HeaderFull from "../../components/header/HeaderFull";
import Image from "next/image";
import NextPage from "../../components/next/NextPage";
import MoveBox from "../../components/move-box/MoveBox";
import TitleSection from "../../components/heading/TitleSection";

import TitleCover from "../../components/heading/TitleCover";
import Button from "../../components/button/Button";


function Project3(params) {
  const heroData = getPortfolioItem('remote_work');
  return (
    <Layout>
      <HeaderFull className="dsn-container"
                  alignItems="end"
                  heroContent={heroData} overlay={heroData.overlay}/>

      {/*Start Intro Project*/}
    <section className="intro-project container section-margin">
      <DsnGrid customGrid={{desktop:"40% 60%"}}>
        <div className="intro-project-left">
          <h4 className="title-block text-uppercase mb-20">info</h4>
          <ul className="intro-project-list">
            <li className="p-relative">
              <strong>업무</strong> 리무트
            </li>
            <li className="p-relative">
              <strong>수수료</strong>1개월 10만원
            </li>
            <li className="p-relative">
              <strong>급여일</strong>익월 10일
            </li>
          </ul>
        </div>
        <div className="intro-project-right">
          <h4 className="title-block text-uppercase mb-20">step</h4>
          <p className="intro-project-description">
            업무절차는 아래와 같습니다
          </p>
          <div className="intro-project-cat mt-30">
            <span className="cat-item">회사 검색</span>
            <span className="cat-item">회사 정보 수집</span>
            <span className="cat-item">회사 정보 전달</span>
            <span className="cat-item">급여 수령</span>
          </div>
        </div>
      </DsnGrid>
    </section>
    {/*End Intro Project*/}

    <div className="p-relative pt-lg-section">
            <div className="box-info h-100 box-padding background-section ">
                <TitleCover>speaker</TitleCover>
                <TitleSection
                    className={"text-uppercase mb-30"}
                    defaultSpace={false}
                >
                    상세히 알고 싶으신가요?
                </TitleSection>
                <p className="mt-15">
                    영업 프로세스는 오프라인 교육을 통해 안내됩니다
                </p>
                {/*<Button href="https://naver.com" className="mt-30">
                    View More <span className="icon">⟶</span>
                </Button>*/}
            </div>
        </div>

    {/*Start Intro Project*/}
    <section className="container section-margin text-center">
      <div className="p-relative">
        <h4 className="title-block dsn-text max-w570 ml-auto mr-auto mb-70 sm-mb-30">
          개발 및 단순 반복작업 비상주 외국인이 필요한 회사에게 100-200만원의 비용으로 온라인 매칭하는 업무
        </h4>
      </div>
    </section>
    {/*End Intro Project*/}

        {/*Start Box Info Move Content*/}
          <div className="p-relative section-margin v-light">
              <ParallaxImage src="/img/work/remote_work.jpg" overlay={2} alt={""}/>
              <MoveBox>
                  <TitleSection className={`align-items-start mb-30`}
                                defaultSpace={false}>
                      매월 10만원 x N 수익
                  </TitleSection>


                  <p className="mb-10">고용과 해고가 자유로운 비상주 외국인 고용</p>
                  <p className="mb-10">급여 예시) 10명을 6개월 비상주 계약시 600만원 수익</p>

              </MoveBox>
          </div>
        {/*End Box Info Move Content*/}

      {/*========== Start Next Page Section ==========*/}
      <NextPage className={`background-section section-padding`}/>
      {/*========== End Next Page Section ==========*/}
      <NextProject heroContent={getPortfolioItem('consulting')} number={4}  />
    </Layout>
  );
}

export default Project3;
