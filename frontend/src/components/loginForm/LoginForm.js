import React, { useState } from 'react';

function LoginForm() {
  // Controlled inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        // store what the Header/Routines need
        localStorage.setItem('userId', String(data.userId));
        localStorage.setItem('username', data.username);

        // go to routines page - change to project route for project
        window.location.href = '/routines';
      });

    // (no error handling here on purpose — pure happy path)
  };

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