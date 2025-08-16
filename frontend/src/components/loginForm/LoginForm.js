import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function LoginForm() {
  // Controlled inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  // Minimal submit handler: happy path only
  const handleSubmit = (e) => {
    e.preventDefault(); // don’t reload the page

    // POST credentials to backend
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then((res) => res.json()) // parse JSON response
      .then((data) => {
        // store what the Header/Routines need in localstorage
        localStorage.setItem('userId', String(data.userId));
        localStorage.setItem('username', data.username);

        // Use React Router to navigate to routines page when login successful
        navigate('/routines');
      });
  };

  // rendered to the page
  return (
    <div className="auth-card">
      <h2>Log in</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

export default LoginForm;