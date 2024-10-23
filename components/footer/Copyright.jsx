import {dsnCN} from "../../hooks/helper";

function Copyright({className, ...restProps}) {
    return (
        <>
        <h5 className={dsnCN(className)} {...restProps}>
            {new Date().getFullYear()} © Made with <span className="love">♥</span>by 
            <a className="link-hover" data-hover-text="주식회사 워크비자" target="_blank"
               rel="nofollow"
               href="https://workvisa.co.kr">주식회사 워크비자</a>
        </h5>
        <h5>
            <span style={{marginLeft:"10px"}}>사업자등록번호 : 673-87-02961</span>
        </h5>
        <h5>
            <span style={{marginLeft:"10px"}}>대표 : 고경우</span>
        </h5>
        <h5>
            <span style={{marginLeft:"10px"}}>E-mail : workvisa@naver.com</span>
        </h5>
        <h5>
            <span style={{marginLeft:"10px"}}>phone : 010-4242-3088</span>
        </h5>
        </>
    );
}


export default Copyright;