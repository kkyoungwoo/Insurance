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
  const heroData = getPortfolioItem('free_headhunting');
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
                <strong>업무</strong>외국인 합법취업을 필요로하는 회사 미팅
              </li>
              <li className="p-relative">
                <strong>수수료</strong>- 원
              </li>
              <li className="p-relative">
                <strong>급여일</strong>- 일
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
              <span className="cat-item">워크비자에 구인요청서, 사업자등록증 서류 전달</span>
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
          외국인이 필요한 사업장에서 미팅을 진행하는 업무
        </h4>
      </div>
    </section>
    {/*End Intro Project*/}

        {/*Start Box Info Move Content*/}
          <div className="p-relative section-margin v-light">
              <ParallaxImage src="/img/work/free_headhunting.jpg" overlay={2} alt={""}/>
              <MoveBox>
                  <TitleSection className={`align-items-start mb-30`}
                                defaultSpace={false}>
                      워크비자에서 진행하는 업무
                  </TitleSection>
                  <p className="mb-10">1. 외국인 합법취업 가능성 확인</p>
                  <p className="mb-10">2. 외국인 이력서를 기업에 전달</p>

              </MoveBox>
          </div>
        {/*End Box Info Move Content*/}

      {/*========== Start Next Page Section ==========*/}
      <NextPage className={`background-section section-padding`}/>
      {/*========== End Next Page Section ==========*/}
      <NextProject heroContent={getPortfolioItem('paid_headhunting')} number={2}  />
    </Layout>
  );
}

export default Project3;
