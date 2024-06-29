import React, { useState } from "react";
import api from "../api";
import {jwtDecode} from "jwt-decode";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { username, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      setToken(jwtDecode(token));
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto w-full bg-gray-500 rounded-lg">
      <h1 className="text-3xl text-center font-semibold my-7 text-white">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        <input
          placeholder="Username"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          placeholder="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <button className="bg-blue-700 text-white p-3 rounded-lg uppercase disabled:opacity-30">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
