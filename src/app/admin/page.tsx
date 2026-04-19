"use client";

import { useState } from "react";
import axios from "axios";
import { LazyMotion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const[error,setError]=useState("");
  const login = async () => {
    try {
      setError(""); // reset

      const res = await axios.post("http://127.0.0.1:8000/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin/dashboard";

    } catch (err: any) {
      // 👇 handle error from Laravel
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong");
      }
    }

  };

  return (
    <main className="h-screen flex items-center justify-center px-6">

      <div className="card w-full max-w-sm">
        <h2 className="text-2xl mb-6">Admin Login</h2>
 {error && (
  <div
    className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm"
  >
    {error}
  </div>
)}
        <input
          placeholder="Email"
          className="input mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="input mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} className="w-full bg-white text-black py-3 rounded-xl">
          Login
        </button>
      </div>

    </main>
  );
}