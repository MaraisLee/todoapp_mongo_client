import React, { useState } from "react";

const ListItem = React.memo(({ item, todoData, setTodoData }) => {
  // console.log("ListItem Rendering...");
  // is Editing  false  : 목록 보여줌
  // is Editing  true  : 편집 보여줌
  const [isEditing, setIsEditing] = useState(false);
  // 제목을 출력하고 변경하는 State
  // 편집창에는 타이틀이 먼저 작성되어야 있어야 하므로
  const [editedTitle, setEditedTitle] = useState(item.title);

  const deleteClick = (id) => {
    // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
    const nowTodo = todoData.filter((item) => item.id !== id);
    // console.log("클릭", nowTodo);
    setTodoData(nowTodo);

    localStorage.setItem("todoData", JSON.stringify(nowTodo));
  };

  // 편집창 내용 갱신 처리
  const editChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const toggleClick = (id) => {
    // map을 통해서 todoData 의 complete를 업데이트해보자
    const updateTodo = todoData.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });

  // axios 를 이용해서 MongoDB complete 업데이트
    setTodoData(updateTodo);
    // 로컬에 저장(DB 저장)
    localStorage.setItem("todoData", JSON.stringify(updateTodo));
  };

  // 현제 item.id 에 해당하는 값만 업데이트한다.
  const todoId = item.id;
  const updateTitle = () => {
    let tempTodo = todoData.map((item) => {
      // 모든 todoData 중에 현재 ID 와 같다면
      if (item.id === todoId) {
        // 타이틀 글자를 수정하겠다.
        item.title = editedTitle;
      }
      return item;
    });
    // 데이터 갱신
    // axios 를 이용해서 MongoDB 타이틀 업데이트
    setTodoData(tempTodo);
    localStorage.setItem("todoData", JSON.stringify(tempTodo));

    // 목록창으로 이동
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100">
        <div className="items-center">
          <input
            type="text"
            className="w-full px-3 py-2 mr-4 text-gray-500 bg-white border rounded"
            value={editedTitle}
            onChange={editChange}
          />
        </div>

        <div className="items-center cursor-pointer">
          <button className="px-4 py-2" onClick={updateTitle}>
            Update
          </button>
          <button className="px-4 py-2" onClick={() => setIsEditing(false)}>
            Close
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100">
        <div className="items-center">
          <input
            type="checkbox"
            defaultChecked={item.completed}
            onChange={() => toggleClick(item.id)}
          />{" "}
          <span className={item.completed ? "line-through" : "none"}>
            {item.title}
          </span>
        </div>

        <div className="items-center cursor-pointer">
          <button
            className="px-4 "
            onClick={() => {
              setIsEditing(true);
              setEditedTitle(item.title);
            }}
          >
            Edit
          </button>
          <button onClick={() => deleteClick(item.id)}>x</button>
        </div>
      </div>
    );
  }
});

export default ListItem;
