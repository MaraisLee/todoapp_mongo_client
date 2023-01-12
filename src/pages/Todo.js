import React, { useState, useEffect } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
// 1. 로그인 여부 파악
import { useSelector } from "react-redux";
import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";
import { useNavigate } from "react-router";
import Loading from "../components/Loading";
import LoadingSpinner from "../components/LoadingSpinner";

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
  const [loading, setLoading] = useState(false);

  // 2. 로그인 상태 파악
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // console.log("user", user);
  useEffect(() => {
    if (user.accessToken === "") {
      // 로그인 x
      alert("로그인을 하세요.");
      navigate("/login");
    } else {
      // 로그인 0
    }
  }, [user]);

  // 목록 정렬 기능
  const [sort, setSort] = useState("최신순");
  useEffect(() => {
    setSkip(0);
    getList(search, 0);
  }, [sort]);

  // 검색 기능
  const [search, setSearch] = useState("");
  const searchHandler = () => {
    setSkip(0);
    setTodoData([]);
    getList(search);
  };

  // axios 를 이용해서 서버에 API 호출
  // 전체 목록 호출 메서드
  // 목록 작성시 화면 나가는 현상 해결.
  const getList = (_word = "", _stIndex = 0) => {
    setSkip(0);
    setSkipToggle(true);
    // 로딩창
    setLoading(true);

    const body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };

    axios
      .post("/api/post/list", body)
      .then((res) => {
        // console.log(res.data);
        // 초기 할일데이터 셋팅
        if (res.data.success) {
          setTodoData(res.data.initTodo);
          // 시작하는 skip 번호를 갱신한다.
          setSkip(res.data.initTodo.length);
          if (res.data.initTodo.length < 5) {
            setSkipToggle(false);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 더보기 버튼을 위한 getList
  const getListGo = (_word = "", _stIndex = 0) => {
    // 로딩창
    setLoading(true);

    const body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };

    axios
      .post("/api/post/list", body)
      .then((res) => {
        // console.log(res.data);
        // 초기 할일데이터 셋팅
        if (res.data.success) {
          const newArr = res.data.initTodo;
          setTodoData([...todoData, ...newArr]);
          // 시작하는 skip 번호를 갱신한다.
          setSkip(skip + newArr.length);
          if (newArr.length < 5) {
            setSkipToggle(false);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 목록 개수 출력
  const [skip, setSkip] = useState(0);
  const [skipToggle, setSkipToggle] = useState(true);

  const getListMore = () => {
    getListGo(search, skip);
  };

  useEffect(() => {
    getList("", skip);
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
      title: todoValue, //할일 입력창의 내용을 추가
      completed: false,
      // DB 저장 1. server/model/TodoModel Schema업데이트 (ObjectId)
      uid: user.uid, // 여러명의 사용자 구분용도
    };
    // 새로운 할일을 일단 복사하고, 복사된 배열에 추가해서 업뎃
    // 기존 할일을 Destructuring 하여서 복사본 만듬
    // todoData: [] 배열
    // axios 로 MongoDB 에 항목 추가
    axios
      .post("/api/post/submit", { ...addTodo })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          // 검색어 초기화 (필수!!)
          setSearch("");
          // 목록 재호출
          setSkip(0);
          getList("", 0);
          // setTodoData([...todoData, addTodo]);
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
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // axios를 이용하여 MongoDB 목록 비워줌
      axios
        .post("/api/post/deleteall")
        .then(() => {
          setSkip(0);
          setTodoData([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // 배열 비우기
    // 로컬에 저장한다.(DB예정)
    // 자료를 지운다.(DB 초기화)
    // localStorage.clear();
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full p-6 m-4 bg-white shadow">
        <div className="flex justify-between mb-3">
          <h1>할일 목록</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>

        <div className="flex justify-between mb-3">
          <DropdownButton title={sort} variant="outline-secondary">
            <Dropdown.Item onClick={() => setSort("최신순")}>
              최신순
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSort("과거순")}>
              과거순
            </Dropdown.Item>
          </DropdownButton>
          <div>
            <label className="mr-2">검색 </label>
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              className="border-2"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              // enter 눌렀을때
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchHandler();
                }
              }}
            />
          </div>
        </div>

        <List todoData={todoData} setTodoData={setTodoData} />
        {skipToggle && (
          <div className="flex justify-center ">
            <button
              className="p-2 text-black-400 border-2 border-ubfi-400 rounded hover:text-white hover:bg-red-400"
              onClick={() => getListMore()}
            >
              더보기
            </button>
          </div>
        )}
        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>
      {/* 로딩창 */}
      {/* 로딩 참이면 spinner 0 */}
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Todo;
