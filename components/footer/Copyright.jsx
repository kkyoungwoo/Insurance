import { dsnCN } from "../../hooks/helper";
import Link from "next/link";

function Copyright({ className, ...restProps }) {
  const copyEmail = () => {
    navigator.clipboard.writeText("workvisa@naver.com");
    alert("이메일이 복사되었습니다.");
  };

  return (
    <>
      <h5 className={dsnCN(className)} {...restProps}>
        {new Date().getFullYear()} © Made with <span className="love">♥</span> by{" "}
        <a
          className="link-hover"
          data-hover-text="주식회사 워크비자"
          target="_blank"
          rel="noopener noreferrer nofollow"
          href="https://workvisa.co.kr"
        >
          주식회사 워크비자
        </a>
      </h5>
      <h5 className="copyright-info">사업자등록번호 : 673-87-02961</h5>
      <h5 className="copyright-info">대표 : 고경우</h5>
      <h5 className="copyright-info email" onClick={copyEmail}>
        E-mail : workvisa@naver.com
      </h5>
      <div>
        <Link href="/dbmaker">DB 프로그램</Link>
      </div>

      <style jsx>{`
        .copyright-info {
          margin-left: 10px;
        }
        .email {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default Copyright;
