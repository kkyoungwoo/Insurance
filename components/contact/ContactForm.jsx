import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { dsnCN } from "../../hooks/helper";
import TitleSection from "../heading/TitleSection";

function ContactForm({ className }) {
    const form = useRef();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [textItem, setTextItem] = useState("");
    const [submissionTime] = useState(new Date().toLocaleDateString());
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const value = "영업문의";

    const sendEmail = (e) => {
        e.preventDefault();

        if (!name || !phone || !address) {
            alert("모든 필드를 작성해주세요.");
            return;
        }

        setResult(false);
        setLoading(true);
        setButtonDisabled(true);

        emailjs
        .sendForm(
          "service_nxcsbyo",
          "template_fxi2kyw",
          form.current,
          "-NM445PE3C53bi7A-"
        )
            .then(
                (result) => {
                    console.log(result.text);
                    alert("입력하신 내용으로 정상접수 되었습니다. 곧 연락드리겠습니다.");
                    setLoading(false);
                    setResult(true);
                    form.current.reset();
                    setName("");
                    setPhone("");
                    setAddress("");
                    setTextItem("");
                    setTimeout(() => setButtonDisabled(false), 1000);
                },
                (error) => {
                    console.log(error.text);
                    setLoading(false);
                    alert("메일이 발송되지 않았습니다. 연락처 : 010-4242-3088");
                    setTimeout(() => setButtonDisabled(false), 1000);
                }
            );
    };

    return (
        <div className={dsnCN('form-box', className)}>
            <div className="line line-top" />
            <div className="line line-bottom" />
            <div className="line line-left" />
            <div className="line line-right" />

            <TitleSection description="Stay connected" defaultSpace={false}>
                상담 문의하기
            </TitleSection>
            <p className="mb-30 mt-20">
                아래 양식을 이용하여 문의내용을 보내주세요
            </p>

            <form className="form" ref={form} onSubmit={sendEmail}>
                <div className="input__wrap controls">
                    <div className="form-group">
                        <div className="entry-box">
                            <label>이름</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="이름을 입력하세요"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                    <div className="entry-box">
                        <label>전화번호</label>
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            placeholder="전화번호를 입력하세요"
                            required
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // 숫자만 추출
                                let formattedValue = value;
                            
                                if (value.length > 3 && value.length <= 7) {
                                    formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
                                } else if (value.length > 7) {
                                    formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
                                }
                            
                                setPhone(formattedValue);
                            }}
                            maxLength={13} // 최대 길이 설정 (010-1234-5678)
                        />
                    </div>
                    </div>

                    <div className="form-group">
                        <div className="entry-box">
                            <label>거주지</label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                placeholder="거주지를 입력하세요"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="entry-box">
                            <label>문의 내용 및 자기소개</label>
                            <textarea
                                id="textItem"
                                className="form-control"
                                name="textitem"
                                rows={4}
                                placeholder="문의 내용을 입력하세요"
                                value={textItem}
                                onChange={(e) => setTextItem(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="entry-box" style={{ display: "none" }}>
                        <label>제출 시간</label>
                        <input id="submissionTime" type="text" name="submissionTime" value={submissionTime} readOnly />
                    </div>

                    <div className="entry-box" style={{ display: "none" }}>
                        <label>value</label>
                        <input id="value" type="text" name="value" value={value} readOnly />
                    </div>

                    <div className="text-right">
                        <div className="image-zoom w-auto d-inline-block" data-dsn="parallax">
                            <button
                                type="submit"
                                className="dsn-button"
                                style={{ cursor: "pointer" }}
                                disabled={buttonDisabled}
                            >
                                <span className="dsn-border border-color-default" />
                                <span className="text-button">문의 신청하기</span>
                            </button>
                        </div>
                        {loading && <div className="loading-message mt-20">메세지 발송중 ...</div>}
                        {result && (
                            <p className="success-message mt-20">메시지가 성공적으로 전송되었습니다. 곧 연락드리겠습니다</p>
                        )}
                    </div>
                </div>
            </form>

            <style jsx>{`
    .form input, .form textarea {
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 10px 15px;
        font-size: 16px;
        color: #000 !important; /* 텍스트 색상 강제 적용 */
        transition: all 0.3s ease;
        margin-bottom: 15px;
    }

    .form input:focus, .form textarea:focus {
        border-color: #4caf50;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
    }

    .form textarea {
        resize: none;
    }

    .dsn-button .text-button {
        color: #fff;
        background: #4caf50;
        padding: 10px 20px;
        border-radius: 5px;
        transition: all 0.3s ease;
    }

    .dsn-button .text-button:hover {
        background: #45a049;
    }
`}</style>

        </div>
    );
}

export default ContactForm;