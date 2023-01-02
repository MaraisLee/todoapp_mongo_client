import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";

// 클래스/함수 컴포넌트(용도별로 2가지케이스)
// 내용 출력 전용, 데이터관리 용도

// 클래스 형식으로 제작되는 것 class: TypeScript
// state 를 리랜더링(Re-rendering)
// life-cyle: Mounte, Update, unMount..

// 함수 형식으로 제작되는 것 function
// state 를 못쓰므로 화면 갱신이 어렵다.
// useState() state 변경가능
// ----------------------------------
// Life-cycle을 지원 안한다.
// useEffect() Life-cycle 체크가능

/*
최초에 로컬에서 todoData를 읽어와서
todoData 라는  useState 를 초기화해 주어야 한다.
useState(초기값) 
초기값: 로컬에서 불러서 채운다
*/

// 로컬스토리지에 내용을 읽어온다
// MongoDB 에서 목록을 읽어온다.
// let initTodo = localStorage.getItem("todoData");
// initTodo = initTodo ? JSON.parse(initTodo) : [];

const Todo = () => {
  // console.log("App Rendering...");
  // MongoDB 에서 초기값읽어서 셋팅
  // const [todoData, setTodoData] = useState([initTodo]);
  const [todoData, setTodoData] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  // axios 를 이용해서 서버에 API 호출
  useEffect(() => {
    axios
      .post("/api/post/list")
      .then((res) => {
        // console.log(res.data);
        // 초기 할일데이터 셋팅
        if (res.data.success) {
          setTodoData(res.data.initTodo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // 초기데이터를 컴포넌트가 마운트 될때 한번 실행.
  }, []);

  const addTodoSubmit = (event) => {
    event.preventDefault();

    // 공백 문자열 제거 추가
    let str = todoValue;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("내용을 입력하세요.");
      setTodoValue("");
      return;
    }
    // { id: 4, title: "할일 4", completed: false },
    // 위의 todoData가 배열이라서 이것도 규칙에 맞춰줌
    const addTodo = {
      id: Date.now(), //id 값은 배열 .map의 key 로 활용예정
      title: todoValue,
      completed: false,
    };
    // 새로운 할일을 일단 복사하고, 복사된 배열에 추가해서 업뎃
    // 기존 할일을 Destructuring 하여서 복사본 만듬
    // todoData: [] 배열
    // axios 로 MongoDB 에 항목 추가
    axios
      .post("/api/post/submit", {
        ...addTodo,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          setTodoData([...todoData, addTodo]);
          setTodoValue("");
          // 로컬에 저장 (DB예정)
          // localStorage.setItem("todoData", JSON.stringify([...todoData, addTodo]));

          alert("등록 완료");
        } else {
          alert("등록 실패");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAllClick = () => {
    // axios를 이용하여 MongoDB 목록 비워줌
    // 배열 비우기
    setTodoData([]);
    // 로컬에 저장한다.(DB예정)
    // 자료를 지운다.(DB 초기화)
    localStorage.clear();
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full p-6 m-4 bg-white shadow">
        <div className="flex justify-between mb-3">
          <h1>할일 목록</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>
        <List todoData={todoData} setTodoData={setTodoData} />
        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>
    </div>
  );
};

export default Todo;
