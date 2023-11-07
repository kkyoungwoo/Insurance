import React from 'react';
import {dsnCN} from "../../hooks/helper";

function InfoBox({className}) {
    return (

        <div className={dsnCN('box-info-contact', className)}>
            <ul>
                <li>
                    <h5 className="title-block mb-15">Contact</h5>
                    <p className="text-p ">+82 (010) 4242 3088</p>
                    <div className="over-hidden mt-5">
                        <div>workvisa@naver.com</div>
                    </div>

                </li>
                <li>
                    <h5 className="title-block mb-15">Address</h5>
                    <p className="text-p">경상북도<br /> 칠곡군 지천면 상납2길 11-5</p>
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