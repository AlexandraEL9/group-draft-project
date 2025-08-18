// frontend/src/components/LoginForm.jsx
import { useNavigate } from "react-router-dom"; // navigation to routines page from login button
import { login } from "../../src/api/auth"; // your wrapper that POSTs /login

export default function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = fd.get("username");
    const password = fd.get("password");

    try {
      const { userId, username: name } = await login(username, password);
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("username", name);
      navigate("/routines", { replace: true });
    } catch {
      // keep it ultra-minimal; upgrade later if we want
      alert("Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" autoComplete="username" />
      <input name="password" type="password" placeholder="Password" autoComplete="current-password" />
      <button>Log in</button>
    </form>
  );
}

