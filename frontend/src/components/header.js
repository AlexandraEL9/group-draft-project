import React from "react";

export default function Header() {
  const username = localStorage.getItem("username") || "";
  return (
    <header className="header">
      <h1>Hi {username}! Let's get started with your routine</h1>
    </header>
  );
}
