import React, { useEffect } from "react";

// react-redux 모듈
import { useDispatch } from "react-redux";
import { loginUser, clearUser } from "./reducer/userSlice";
// fb 라이브러리 모듈
import firebase from "./firebase";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserInfo from "./pages/UserInfo";
import NotFound from "./pages/NotFound";

export default function App() {
  // action 보내기
  const dispatch = useDispatch();
  // 내용출력하기
  // const user = useSelector((state) => state.user);

  // 로그인 상태 테스트
  // {nickName: "",uid: "", accessToken: ""}
  useEffect(() => {
    // fire 의 사용자 로그인 변경 이벤트
    firebase.auth().onAuthStateChanged((userInfo) => {
      // fb 에 로그인 시 출력 정보확인.
      // console.log("로그인정보:", userInfo);
      if (userInfo) {
        // 로그인 시
        // store.user.state 에 저장 해야뎀
        dispatch(loginUser(userInfo.multiFactor.user));
      } else {
        // 로그아웃 시
        // store.user.state 초기화 해야뎀
        dispatch(clearUser());
      }
    });
  });

  //   // 임시로 로그아웃을 컴포넌트가 마운트 될때 실행
  // useEffect(() => {
  //   firebase.auth().signOut();
  // }, []);

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Todo" element={<Todo />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
