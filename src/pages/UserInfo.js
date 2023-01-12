import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignUpDiv from "../styles/signUpCss";
// firebase 기본포드 포함
import firebase from "../firebase.js";
import axios from "axios";
import { useSelector } from "react-redux";
// user 정보 가져오기

const UserInfo = () => {
  // 사용자 정보수정을 위해 정보 가지고 옴
  const user = useSelector((state) => state.user);
  const fireUser = firebase.auth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");

  useEffect(() => {
    setNickName(user.nickName);
    setEmail(user.email);
    setPw("");
    setPwCheck("");
  }, []);

  // 연속버튼 막는 변수
  const [btFlag, setBtFlag] = useState(false);

  const navigate = useNavigate();

  // 이름 중복 검사
  const [nickName, setNickName] = useState("");
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
  // 닉네임 변경요청
  const nameUpdateFn = (e) => {
    e.preventDefault();
    if (!nickName) {
      return alert("닉네임을 입력하세요.");
    }
    // 닉네임 검사 요청
    if (!nameCheck) {
      return alert("닉네임 중복검사를 해주세요.");
    }
    fireUser.currentUser
      .updateProfile({
        displayName: nickName,
      })
      .then(() => {
        alert("닉네임을 변경하였습니다.");
        setNickName(nickName);
      })
      .catch((error) => {
        // 로그인 실패
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  // 이메일 변경요청
  const emailUpdateFn = (e) => {
    e.preventDefault();
    // 닉네임 검사 요청
    if (!email) {
      return alert("이메일을 입력하세요.");
    }
    // fb 이메일 변경요청
    fireUser.currentUser
      .updateEmail(email)
      .then(() => {
        alert("이메일을 변경하였습니다.");
        setEmail(email);
      })
      .catch((error) => {
        // 로그인 실패
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  // 비밀번호 변경요청
  const passUpdateFn = (e) => {
    e.preventDefault();
    if (!pw) {
      return alert("비밀번호를 입력하세요.");
    }
    if (!pwCheck) {
      return alert("비밀번호 확인을 입력하세요.");
    }
    // 비밀번호가 같은지 비교처리
    if (pw !== pwCheck) {
      return alert("비밀번호는 같아야 합니다.");
    }
    // fb 비밀번호 변경요청
    fireUser.currentUser
      .updatePassword(pw)
      .then(() => {
        alert("비밀번호를 변경하였습니다.");
        setPw(pw);
        setPwCheck("");
      })
      .catch((error) => {
        // 로그인 실패
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  // 회원 탈퇴
  const registOutFunc = (e) => {
    e.preventDefault();
    // fb 회원 삭제
    fireUser.currentUser
      .delete()
      .then(() => {
        // 사용자의 할일 전부 삭제
        // 사용자 정보도 삭제
        let body = {
          uid: user.uid,
        };
        axios
          .post("/api/post/userout", body)
          .then((response) => {
            if (response.data.success) {
              alert("회원 탈퇴하였습니다.");
              // 회원정보 삭제 성공
              navigate("/login");
            } else {
              // 회원정보 삭제 실패
              console.log("회원정보 저장 실패시에는 다시 저장을 도전한다.");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div className="p-6 m-4 shadow">
      <h2>User Info</h2>
      <SignUpDiv>
        <form>
          <div className="flex justify-start mb-3">
            <label className="mr-5 text-xl ">닉네임</label>
            <input
              type="text"
              className="mr-5"
              required
              maxLength={20}
              minLength={3}
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <button className="mr-5" onClick={(e) => nameCheckFn(e)}>
              닉네임 중복검사
            </button>
            <button onClick={(e) => nameUpdateFn(e)}>닉네임 변경</button>
          </div>
        </form>

        <form>
          <div className="flex justify-start mb-3">
            <label className="mr-5 text-xl">이메일</label>
            <input
              type="email"
              className="mr-5"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={(e) => emailUpdateFn(e)}>이메일 변경</button>
          </div>
        </form>
        <form>
          <div className="mb-3">
            <div className=" text-xl font-bold mb-3">비밀번호 변경</div>
            <div className="flex justify-start mb-3">
              <label className="mr-5 text-sm items-center ">비밀번호</label>
              <input
                type="password"
                className="mr-5"
                required
                maxLength={16}
                minLength={6}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <label className="mr-5 text-sm items-center ">
                비밀번호 확인
              </label>
              <input
                type="password"
                className="mr-5"
                required
                maxLength={16}
                minLength={6}
                value={pwCheck}
                onChange={(e) => setPwCheck(e.target.value)}
              />

              <button disabled={btFlag} onClick={(e) => passUpdateFn(e)}>
                비밀번호 변경
              </button>
            </div>
          </div>
        </form>

        <div className="flex justify-start">
          <button disabled={btFlag} onClick={(e) => registOutFunc(e)}>
            회원탈퇴
          </button>
        </div>
      </SignUpDiv>
    </div>
  );
};

export default UserInfo;
