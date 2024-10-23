import React, {useRef, useState} from 'react';
import emailjs from '@emailjs/browser';
import {dsnCN} from "../../hooks/helper";
import TitleSection from "../heading/TitleSection";

function ContactForm({className}) {

    const form = useRef();
    const [loading, setLoading] = useState();
    const [result, setResult] = useState();
    const value = "영업문의";

    const sendEmail = (e) => {
        e.preventDefault();
        setResult(false);
        setLoading(true);
        emailjs
          .sendForm(
            "service_jde2c6d",
            "template_v84zso7",
            e.target,
            "k3SwW8-jUq-GVrmk7"
          )
          .then(
            (result) => {
                console.log(result.text);
                alert("입력하신 내용으로 정상접수 되었습니다. 곧 연락드리겠습니다.")
                setLoading(false);
                setResult(true);
                form.current.reset();
            },
            (error) => {
                console.log(error.text);
                setLoading(false);
                alert("메일이 발송되지 않았습니다. 연락처 : 010-4242-3088")
            }
          );
      };

    setTimeout(() => setResult(false), 5000);


    return (

            <div className={dsnCN('form-box', className)}>
                <div className="line line-top" />
                <div className="line line-bottom" />
                <div className="line line-left" />
                <div className="line line-right" />

                <TitleSection description="Stay connected" defaultSpace={false}>
                    문의작성
                </TitleSection>
                <p className="mb-30 mt-20">
                    이메일 또는 연락처로 문의내용을 보내주세요
                </p>

                <form  className="form"  ref={form} onSubmit={sendEmail} >
    <div className="input__wrap controls">
        <div className="form-group">
            <div className="entry-box">
                <label>이름</label>
                <input id="name" type="text" name="name"
                       placeholder="Type your name" required="required"
                       data-error="name is required."
                       readOnly />
            </div>
        </div>

        <div className="form-group">
            <div className="entry-box">
                <label>전화번호</label>
                <input id="phone" type="number" name="phone"
                       placeholder="Type your Phone number" required="required"
                       data-error="Valid Phone number is required."
                       readOnly />
            </div>
        </div>

        <div className="form-group">
            <div className="entry-box">
                <label>거주지</label>
                <input id="location" type="text" name="location"
                       placeholder="Type your Address" required="required"
                       data-error="Valid address is required."
                       readOnly />
            </div>
        </div>

        <div className="form-group">
            <div className="entry-box">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <label>문의내용</label>
                <textarea id="message" className="form-control" name="message" rows={4}
                          placeholder="Tell us about you and the work"
                          required="required"
                          data-error="Please, leave us a message."
                          readOnly />
            </div>
        </div>

        <div className="entry-box" style={{display:"none"}}>
            <label>value</label>
            <input id="value" type="text" name="value" value={value} />
        </div>

        <div className="text-right">
            <div className="image-zoom w-auto d-inline-block" data-dsn="parallax">
                <button type="submit" className="dsn-button" style={{cursor:"pointer"}}>
                    <span className="dsn-border border-color-default" />
                    <span className="text-button">문의신청(현재 온라인 접수 불가)</span>
                </button>
            </div>
            {loading && <div className="loading-message mt-20">메세지 발송중 ...</div>}
            {result &&
            <p className="success-message mt-20">메시지가 성공적으로 전송되었습니다. 곧 연락드리겠습니다</p>}
        </div>
    </div>
</form>

            </div>


    );
}

export default ContactForm;