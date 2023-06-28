import React from 'react'

import DsnGrid from "../../layout/DsnGrid";
import ParallaxImage from "../Image/ParallaxImage";
import {dsnCN} from "../../hooks/helper";
import MoveTrigger from "../../animation/MoveTrigger";
import FadeUpTrigger from "../../animation/FadeUpTrigger";


const HeroContent = {
    title: "영업크루를 기다리고 있습니다",
    subtitle: `워크비자는 외국인 관련 서비스를 운영하며 고객의 니즈를 고려한 다양한 수익구조를 가지고 있습니다 `,
    description: `저출산 문제로 중소기업에 인력난 발생<span class="mb-10 d-block" ></span>
    무료 외국인 구인구직으로 인력난 해결<span class="mb-10 d-block" ></span>
    외국인 구인구직 업무를 통한 고소득 프리랜서 모집<span class="mb-10 d-block" ></span>`,
    authorTitle: "제공되는 인프라",
    authorJob: "DB, Semina, VOD, E-Book, On-boarding",
    experienceNumber: "5",
    experienceDescription: `인프라 제공`,
    heroImage: '/img/about-intro.jpg',
    awards: [
        {number: 3, description: `Week<br/>교육`},
        {number: 6, description: `+ α<br/>수익구조`},
    ]
};


function HeroSection({className, ...restProps}) {


    return (
        <section className={dsnCN(`about-section p-relative`, className)} {...restProps}>
            <DsnGrid col={2} colTablet={1} colGap={50} rowGap={40}>
                <div className="box-info pt-60 pb-60">
                    <MoveTrigger from={{y: 0}} to={{y: -70}} tablet={false} mobile={false}>
                        {(ref) => <h2 className="section-title title-move mb-30 text-uppercase"
                                      dangerouslySetInnerHTML={{__html: HeroContent.title}} ref={ref}/>}
                    </MoveTrigger>
                    <FadeUpTrigger>
                        {(ref) => <>
                            <h6 className="title-block border-bottom pb-30 mb-30" ref={ref}>{HeroContent.subtitle}</h6>
                            <p className="mb-30" ref={ref} style={{maxWidth: 570}} dangerouslySetInnerHTML={{__html: HeroContent.description}}/>
                            <h5 className="sm-title-block line-shape line-shape-after mb-10" ref={ref}>{HeroContent.authorTitle}</h5>
                            <span className="sub-heading line-bg-left" ref={ref}>{HeroContent.authorJob}</span>
                            <DsnGrid className="box-awards pt-30" col={2} colTablet={2} colGap={15} rowGap={15}>
                                {HeroContent.awards.map(
                                    (item, index) =>
                                        <div className="box-awards_item has-border " key={index}
                                             ref={ref}>
                                            <div className={`box-awards_inner background-section`}>
                                                <span className="has-animate-number title">{item.number}</span>
                                                <h5 className="sm-title-block"
                                                    dangerouslySetInnerHTML={{__html: item.description}}/>
                                            </div>

                                        </div>
                                )}


                            </DsnGrid>
                        </>}
                    </FadeUpTrigger>


                </div>

                <div className="background-mask p-relative over-hidden">
                    <div className="p-absolute p-20 h-100 w-100">
                        <div className="line line-top"/>
                        <div className="line line-bottom"/>
                        <div className="line line-left"/>
                        <div className="line line-right"/>

                        <div className="img-box h-100">
                            <ParallaxImage src={HeroContent.heroImage} alt={"about"} height="100%" overlay={3}
                                           sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"/>
                        </div>


                        <div
                            className="box-awards-item p-absolute big-number v-dark-head left-0 bottom-0 ml-40 mb-40 z-index-1 border-style">
                            <h5 className="number p-20">
                                    <span className="has-animate-number title"
                                          style={{fontSize: "145px", lineHeight: "120px"}}>
                                        {HeroContent.experienceNumber}
                                    </span>
                                {HeroContent.experienceDescription && <span className="sm-title-block d-block" dangerouslySetInnerHTML={{__html : HeroContent.experienceDescription}} />}

                            </h5>
                        </div>
                    </div>
                </div>
            </DsnGrid>
        </section>
    )
}


export default HeroSection;