import React from "react";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";

const List = React.memo(({ todoData, setTodoData }) => {
  // console.log("List Rendering...");
  // props.todoData;
  // props.setTodoData;
  const user = useSelector((state) => state.user);
  return (
    <div>
      {/* 자바스크립트 문법쓰겟다 {}사용 */}
      {/* () : jsx문법을 쓰겟다~ */}
      {todoData.map(
        (item) =>
          item.author.uid === user.uid && (
            <div key={item.id}>
              <ListItem
                item={item}
                todoData={todoData}
                setTodoData={setTodoData}
              />
            </div>
          )
      )}
    </div>
  );
});

export default List;
