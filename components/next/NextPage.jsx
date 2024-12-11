import {dsnCN} from "../../hooks/helper";
import Button from "../button/Button";
import BgDot from "../header/BgDot";

const NextContent = {
    buttonText: "영업 제안서"
};

const NextContent2 = {
    title: "블루오션, 영업 팀원 모집",
    subtitle: `신입도 빠르게 수익 발생 가능`,
    buttonText: "상담 신청하기",
    Text: "상담 신청하기"
};

function NextPage({className, ...restProps}) {
    return (
        <section className={dsnCN("next-page p-relative d-flex align-items-center", className)}
                 {...restProps}
        >
            <BgDot/>
            <BgDot rightPosition/>
            <div className="container w-100">
                <div className="c-wrapper d-flex justify-content-between">
                    <div className="d-flex flex-column">
                        <p className="sub-heading line-shape line-shape-after ">
                            <span className="line-bg-left">{NextContent2.subtitle}</span>
                        </p>
                        <h2 className="section-title max-w750 mt-15">
                            {NextContent2.title}
                        </h2>
                    </div>
                    <div className="button-box d-flex justify-content-end align-items-center">
                        {/*<Button
                            href={"./free_headhunting.pdf"}
                            target="_blank" rel="noopener noreferrer"
                            className="mr-15 line-head"
                            borderStyle={"border-color-heading-color"}
                            borderRadius
                        >
                            {NextContent.buttonText}
                        </Button>*/}
                        <Button
                            href={"/contact"}
                            className="mr-15 line-head"
                            borderStyle={"border-color-heading-color"}
                            borderRadius
                            transitionPage={{title: NextContent2.Text}}
                        >
                            {NextContent2.buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NextPage;
