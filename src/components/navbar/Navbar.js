import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdShoppingBasket } from "react-icons/md";
import "./Navbar.css";
import Logo from "../../assets/logo.png";

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  return (
    <div className="navbar">
      <div className="logo-navbar">
        <Link to="/">
          <img src={Logo} alt="" />
        </Link>
      </div>
      <ul className="navbar-menu">
        <li
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          <Link to="/">Home</Link>
        </li>
        <li
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          <Link to="/cart">Menu</Link>
        </li>
        <li
          onClick={() => setMenu("contact")}
          className={menu === "contact" ? "active" : ""}
        >
          <Link to="/contact">Contact</Link> 
        </li>
      </ul>

      <div className="navbar-right">
        <CiSearch className="ic_search" />
        <div className="navbar-basket-icon">
          <Link to="/cart">
            <MdShoppingBasket className="ic_basket" />
          </Link>
          <div className="dot"></div>
        </div>

        <button onClick={() => setShowLogin(true)}>Sign in</button>
      </div>
    </div>
  );
};
