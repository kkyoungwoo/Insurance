import React from 'react';
import { dsnCN } from "../../hooks/helper";
import TitleSection from "../heading/TitleSection";

function ContactForm({ className }) {

    return (
        <div className={dsnCN('form-box contact-promotion', className)}>
            <div className="line line-top" />
            <div className="line line-bottom" />
            <div className="line line-left" />
            <div className="line line-right" />

            <TitleSection description="편하게 문의하세요" defaultSpace={false}>
                실시간 카카오톡 채팅
            </TitleSection>
            
            <div className="contact-content">
                <p className="intro-text mb-30 mt-20">
                    실시간으로 빠른 상담이 필요하신가요?<br/>
                    아래 버튼을 클릭하면 카톡 채팅방으로 바로 연결됩니다.
                </p>

                <div className="kakao-section">
                    <a 
                        href="https://open.kakao.com/me/workvisahr" 
                        className="kakao-button"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img 
                            src="/img/kakao-talk-icon.png" 
                            alt="Kakao Talk Icon" 
                            className="kakao-icon"
                        />
                        카카오톡 채팅 시작하기
                    </a>

                    <div className="qr-section mt-40">
                        <p className="qr-guide mb-15">또는 QR 코드를 스캔해주세요</p>
                        <div className="qr-image-box">
                            <img 
                                src="/img/kakao-qr.png" 
                                alt="Kakao Talk QR Code" 
                                className="qr-image"
                            />
                        </div>
                    </div>
                </div>

                <div className="alternative-contact mt-50">
                    <p className="contact-option">
                        <span className="label">이메일 :</span>
                        workvisa@naver.com
                    </p>
                    <p className="contact-option">
                        <span className="label">전화번호 :</span>
                        010-4242-3088
                    </p>
                </div>
            </div>

            <style jsx>{`
                .contact-promotion {
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 40px 30px;
                }

                .intro-text {
                    font-size: 16px;
                    line-height: 1.7;
                    color: #666;
                }

                .kakao-button {
                    background: #FEE500;
                    color: #000;
                    padding: 18px 35px;
                    border-radius: 50px;
                    display: inline-flex;
                    align-items: center;
                    font-weight: 500;
                    transition: transform 0.3s ease;
                    text-decoration: none;
                }

                .kakao-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .kakao-icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 12px;
                }

                .qr-section {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 15px;
                    margin-top: 30px;
                }

                .qr-guide {
                    font-size: 14px;
                    color: #888;
                }

                .qr-image-box {
                    max-width: 200px;
                    margin: 0 auto;
                    padding: 15px;
                    background: white;
                    border-radius: 10px;
                }

                .qr-image {
                    width: 100%;
                    height: auto;
                }

                .alternative-contact {
                    border-top: 1px solid #eee;
                    padding-top: 30px;
                }

                .contact-option {
                    font-size: 15px;
                    color: #555;
                    margin: 8px 0;
                }

                .label {
                    display: inline-block;
                    width: 80px;
                    font-weight: 500;
                    color: #333;
                }

                @media (max-width: 768px) {
                    .contact-promotion {
                        padding: 30px 20px;
                    }
                    
                    .kakao-button {
                        padding: 15px 25px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
}

export default ContactForm;