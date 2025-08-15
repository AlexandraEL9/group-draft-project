import "../../index.scss";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.scss";
// import components
import Logo from "./logo/logo.js";
import Logout from "./logoutButton/logoutButton.js";
import Hamburger from "./hamburger/hamburger.js";

// props to say if its hamburger menu or log in
function Navbar() {
  // function to decide if isLoggedIn is true or false
  const [showHamburger, setShowHamburger] = useState(true);

  const currentPage = useLocation();

  const pagesWithHamburger = ["/", "/login", "/about"];

  useEffect(() => {
    if (pagesWithHamburger.includes(currentPage.pathname)) {
      setShowHamburger(true);
    } else {
      setShowHamburger(false);
    }
  });

  return (
    <>
      <nav>
        <div className="nav-spacer" />
        <Logo />
        {showHamburger ? <Hamburger /> : <Logout />}
      </nav>
    </>
  );
}
export default Navbar;