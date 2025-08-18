// frontend/src/components/Header.jsx
import React from "react";
// import "../styles/Header.css"; // keep if you have it

export default function Header() {
    // pull username from localstorage where held after successful login
  const username = localStorage.getItem("username") || "";
  return (
    <header className="header">
        {/*username passed into header*/}
      <h1>Hi {username}! Let's get started with your routine</h1>
    </header>
  );
}

