// Imports
// `useState` Hook to store local form state.
import React, { useState } from 'react';
// Router: `useNavigate` is a Hook that gives you a `navigate()`function so you can send the user to another route
import { useNavigate } from 'react-router-dom'; 
// API helper: a *named export* from src/api/auth.js that calls POST /login.
import { login } from "../../api/auth";

// A reusable login form component.
// If the parent passes an `onSuccess` prop, we'll call it after a successful login.
export default function LoginForm({ onSuccess }) {

  // controlled inputs
  const [username, setUsername] = useState(""); // holds the current value; `setUsername` updates it.
  const [password, setPassword] = useState(""); //// holds the current value; `setPassword` updates it.
  const [err, setError] = useState(""); // Holds a user-facing error message
  const [loading, setLoading] = useState(false); // disable the button and show "Logging in…" while the request is in flight.
  const navigate = useNavigate(); //Router hook: gives us an imperative `navigate(path, options)` function
  // so we can redirect to "/routines" after a successful login.

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password); // { userId, username, message }
      localStorage.setItem("userId", String(data.userId));
      localStorage.setItem("username", data.username);
      navigate("/routines", { replace: true }); // go straight to routines
    } catch (e) {
      // minimal error read (we haven’t added interceptors yet)
      setError(e?.response?.data?.error || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        autoComplete="username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
      />
      <button type="submit" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
      {err && <p role="alert">{err}</p>}
    </form>
  );
}