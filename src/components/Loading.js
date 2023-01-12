import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = () => {
  // 로딩창 관련

  const loadingCSS = {
    position: "fixed",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5",
  };

  return (
    <div style={loadingCSS}>
      <Spinner animation="border" variant="info" />
    </div>
  );
};

export default Loading;
