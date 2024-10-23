import React from 'react';
import {dsnCN} from "../../hooks/helper";

function InfoBox({className}) {
    const copyEmail = () => {
        navigator.clipboard.writeText("workvisa@naver.com");
        alert("이메일이 복사되었습니다.");
    };

    return (
        <div className={dsnCN('box-info-contact', className)}>
            <ul>
                <li>
                    <h5 className="title-block mb-15">Contact</h5>
                    <p className="text-p">
                        <a href="tel:+821042423088">+82 (010) 4242 3088</a>
                    </p>
                    <div className="over-hidden mt-5" style={{cursor: "pointer"}} onClick={copyEmail}>
                        <div>workvisa@naver.com</div>
                    </div>
                </li>
                <li>
                    <h5 className="title-block mb-15">Address</h5>
                    <p className="text-p">대구광역시 동구 장등로 76 대구콘텐츠기업지원센터 302호</p>
                </li>
                <li>
                    <h5 className="title-block mb-15">Follow Us</h5>
                    <div className="social-item over-hidden">
                        <a className="link-hover" data-hover-text="kakaoTalk Message" href="http://pf.kakao.com/_qiXpxj"
                           target="_blank" rel="nofollow">카카오톡 문의하기</a>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default InfoBox;
