import React from 'react';
import {dsnCN} from "../../../hooks/helper";

function MenuContent({className}) {
    const socialData = [
        {link: "http://pf.kakao.com/_qiXpxj", name: "kakao 채팅 문의."},
    ];

    // 이메일 복사 함수
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('이메일 주소가 클립보드에 복사되었습니다.');
            })
            .catch((err) => {
                console.error('복사 실패:', err);
            });
    };

    return (
        <div className={dsnCN('container-content  d-flex flex-column justify-content-center', className)}>
            <div className="nav__info">
                <div className="nav-content mt-30">
                    <h5 className="sm-title-block mb-10">Contact</h5>
                    <p className="links over-hidden mb-1">
                        <a className="link-hover" href="tel:010 4242 3088" data-hover-text="010 4242 3088">
                            010 4242 3088
                        </a>
                    </p>
                    <p className="links over-hidden">
                        <span 
                            className="link-hover" 
                            onClick={() => copyToClipboard('workvisa@naver.com')}
                            style={{cursor: "pointer"}}
                            data-hover-text="workvisa@naver.com">
                            workvisa@naver.com (클릭하여 복사)
                        </span>
                    </p>
                </div>
            </div>
            <div className="nav-social nav-content mt-30">
                <div className="nav-social-inner p-relative">
                    <h5 className="sm-title-block mb-10">Follow us</h5>
                    <ul>
                        {socialData.map((item, index) =>
                            <li key={index}>
                                <a href={item.link} target="_blank" rel="nofollow noopener noreferrer">{item.name}</a>
                            </li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MenuContent;
