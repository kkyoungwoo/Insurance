import {dsnCN} from "../../hooks/helper";
import Button from "../button/Button";
import BgDot from "../header/BgDot";

const NextContent = {
    buttonText: "영업 제안서"
};

const NextContent2 = {
    title: "블루오션 영업크루 모집",
    subtitle: `보험영업 경험자 우대`,
    buttonText: "영업문의"
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
                        <Button
                            href={"https://drive.google.com/file/d/1afU3iChAEwO-uroCoqP4xzIg881i9bbI/view?usp=sharing"}
                            target="_blank" rel="noopener noreferrer"
                            className="mr-15 line-head"
                            borderStyle={"border-color-heading-color"}
                            borderRadius
                        >
                            {NextContent.buttonText}
                        </Button>
                        <Button
                            href={"/contact"}
                            className="mr-15 line-head"
                            borderStyle={"border-color-heading-color"}
                            borderRadius
                            transitionPage={{title: NextContent2.buttonText}}
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
