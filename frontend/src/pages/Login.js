// src/pages/Login.js
import React from 'react';
import '../index.scss';
import LoginForm from '../components/loginForm/LoginForm';

function Login() {  // <-- Capital L
  return (
    <section className="auth-section">
      <LoginForm />
    </section>
  );
}

export default Login;

