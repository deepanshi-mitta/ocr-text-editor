// In src/App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Upload from "./components/Upload";
import Display from "./components/Display";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (!token) {
    return (
      <div className="bg-black flex items-center justify-center h-[100vh]">
        <Login setToken={setToken} />;
      </div>
    );
  }

  return (
    <div className="bg-black flex items-center justify-center h-[100vh]">
      <Upload />
      {/* <Display /> */}
    </div>
  );
};

export default App;
