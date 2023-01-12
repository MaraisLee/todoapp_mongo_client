import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpDiv from "../styles/signUpCss";
// firebase 기본포드 포함
import firebase from "../firebase.js";
import axios from "axios";

const SignUp = () => {
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  // 연속버튼 막는 변수
  const [btFlag, setBtFlag] = useState(false);

  const navigate = useNavigate();

  // firebase 회원가입 기능
  const registFunc = (e) => {
    // 클릭시 웹브라우저 갱신 막기
    e.preventDefault();
    // 각 항목을 입력했는지 체크
    // 빈문자열 체크를 정규표현식으로 추후 업데이트
    // 공백 문자열 제거 추가
    // let str = nickName;
    // str = str.replace(/^\s+|\s+$/gm, "");
    // if (str.length === 0) {
    //   alert("닉네임을 입력하세요.");
    //   setNickName("");
    //   return;
    // }
    // 닉네임이 빈 문자열인지 체크
    if (!nickName) {
      return alert("닉네임을 입력하세요.");
    }
    if (!email) {
      return alert("이메일을 입력하세요.");
    }
    if (!pw) {
      return alert("비밀번호를 입력하세요.");
    }
    if (!pwCheck) {
      return alert("비밀번호 확인을 입력하세요.");
    }

    // 3. 닉네임 검사 요청
    if (!nameCheck) {
      return alert("닉네임 중복검사를 해주세요.");
    }

    // 연속클릭 막기
    setBtFlag(true);

    // firebase 로 이메일과 비밀번호 전송
    const createUser = firebase.auth();
    createUser
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // 회원가입 성공한 경우
        const user = userCredential.user;
        // console.log(user);
        // 사용자 프로필의 displayName 업데이트
        user
          .updateProfile({ displayName: nickName })
          .then(() => {
            // 데이터베이스로 정보를 저장한다.
            // 사용자 정보를 저장한다(이메일, 닉네임, UID(unique id))
            // console.log(user);
            let body = {
              email: user.email,
              displayName: user.displayName,
              uid: user.uid,
            };
            axios
              .post("/api/user/register", body)
              .then((res) => {
                // console.log(res.data);
                if (res.data.success) {
                  // 회원정보 저장 성공
                  alert("회원가입이 완료되었습니다.");
                  firebase.auth().signOut();
                  navigate("/login");
                } else {
                  // 회원정보 저장 실패
                  console.log("회원정보 저장 실패시에는 다시 저장을 도전한다.");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setBtFlag(true);
        // 회원가입 실패한 경우
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(errorCode, errorMessage);
      });
  };

  // 이름 중복 검사
  const [nameCheck, setNameCheck] = useState(false);
  const nameCheckFn = (e) => {
    e.preventDefault();
    // 닉네임이 입력되었는지 체크
    if (!nickName) {
      return alert("닉네임을 입력해주세요.");
    }
    // DB 서버 UserModel 에서 닉네임 존재 여부 파악
    const body = {
      displayName: nickName,
    };
    axios
      .post("/api/user/namecheck", body)
      .then((res) => {
        // 서버에서 정상적 처리
        if (res.data.success) {
          if (res.data.check) {
            // 등록가능 (중복x이므로 ) check=true
            setNameCheck(true);
            alert("등록이 가능합니다.");
          } else {
            // 등록 불가능( 중복 0, 닉네임 이미 존재.) check=false
            setNameCheck(false);
            alert("이미 등록된 닉네임입니다.");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-6 m-4 shadow">
      <h2>SignUp</h2>
      <SignUpDiv>
        <form>
          <label>닉네임</label>
          <input
            type="text"
            value={nickName}
            maxLength={20}
            minLength={3}
            onChange={(e) => {
              setNickName(e.target.value);
            }}
          />
          <button onClick={(e) => nameCheckFn(e)}>닉네임 중복검사</button>
          <label>이메일</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>비밀번호</label>
          <input
            type="password"
            required
            maxLength={16}
            minLength={6}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <label>비밀번호 확인</label>
          <input
            type="password"
            required
            maxLength={16}
            minLength={6}
            value={pwCheck}
            onChange={(e) => setPwCheck(e.target.value)}
          />
          <button disabled={btFlag} onClick={(e) => registFunc(e)}>
            회원가입
          </button>
        </form>
      </SignUpDiv>
    </div>
  );
};

export default SignUp;
