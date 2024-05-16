import {dsnCN} from "../../hooks/helper";

function Copyright({className, ...restProps}) {
    return (
        <>
        <h5 className={dsnCN(className)} {...restProps}>
            {new Date().getFullYear()} © Made with <span className="love">♥</span>by 
            <a className="link-hover" data-hover-text="워크비자" target="_blank"
               rel="nofollow"
               href="https://workvisa.co.kr">워크비자 외국인 헤드헌팅</a>
        </h5>
        <h5>
            <span style={{marginLeft:"10px"}}>사업자등록번호 : 686-92-01981</span>
        </h5>
        <h5>
            <span style={{marginLeft:"10px"}}>대표 : 고경우</span>
        </h5>
        </>
    );
}


export default Copyright;