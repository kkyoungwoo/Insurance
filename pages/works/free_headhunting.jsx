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
                워크비자에 구인요청서 서류 전달
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
      경쟁사는 <strong>Kowork</strong>, <strong>Kwork</strong>, <strong>114114</strong> 등이 있습니다.
      114114는 인력사무소 담당자들이 활동하며, Kowork는 전문 인력만 가능합니다.<br />
      하지만 <strong>워크비자는 단순 인력 매칭도 가능</strong>하여 보다 폭넓은 채용이 가능합니다.
    </p>
  </div>

  <div className="intro-project-section mb-30">
    <h5 className="">맞춤형 채용 컨설팅</h5>
    <p className="intro-project-description">
      기업 방문을 통해 회사의 업종, 업태, 담당 업무, 한국인 인원수 등에 따라 외국인 채용 가능 여부를 
      정확히 확인할 수 있습니다.<br />
      고용 요청서를 작성하면 <strong>전문 상담사가 무료로 채용 가능 여부를 검토</strong>해 드립니다.
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

          <div className="intro-project-right">
            <h4 className="title-block text-uppercase mb-20">TM 생산 스크립트</h4>
            <p className="intro-project-description">
              안녕하세요 OOO(상호) 대표님 맞으시죠?<br />
              외국인 고용 관련해서 안내드리기 위해 연락드렸습니다.<br />
              잠깐 통화 가능하실까요?<br />
              <br />
              저는 “워크 비자” ㅇㅇㅇ 컨설턴트입니다. 저희 회사는 외국인을 합법으로 채용할 수 있는 무료 서비스를 제공해 드리고 있고 
              아웃소싱 및 헤드헌팅이 아닌 직업 정보제공업이 등록되어있는 합법 업체입니다.<br />
              <br />
              대표님께서도 알고 있으실 텐데, 합법적으로 외국인을 채용하려면 회사의 업종/업태/담당업무/한국인 인원수 등에 따라 
              외국인 채용 가능 여부가 달라지기 때문에 전화로는 상담이 어렵습니다. <br />
              만나 뵙고 설명드리는 것이 대표님께 더 도움이 될 것 같아요.<br />
              <br />
              해당 지역의 외국인 고용 전문 상담사가 방문하여 상담이 가능하도록 도와드리겠습니다.<br />
              전문 상담사가 이 번호로 연락드리면 될까요?<br />
              <br />
              네, 감사합니다. 그럼 대표님 회사로 방문드릴 텐데, 방문 주소 부탁드립니다.<br />
              <br />
              행복한 하루 보내세요! 😊
            </p>
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
            워크비자에서 진행하는 업무
          </TitleSection>
          <p className="mb-10">1. 외국인 합법취업 가능성 확인하기</p>
          <p className="mb-10">2. 외국인 이력서를 기업에 전달하기</p>
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
