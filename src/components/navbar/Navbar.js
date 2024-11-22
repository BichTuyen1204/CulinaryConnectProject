import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdShoppingBasket } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="navbar col-12">
      <div className="logo-navbar col-lg-1 col-md-2 col-sm-3 col-12">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      <ul className="navbar-menu col-lg-4 col-md-6 col-sm-5 col-12">
        <li
          onClick={() => setMenu("home")}
          className={`item ${menu === "home" ? "active" : ""}`}
        >
          <Link to="/">Home</Link>
        </li>
        <li
          onClick={() => setMenu("menu")}
          className={`item ${menu === "menu" ? "active" : ""}`}
        >
          <Link to="/food_card">Menu</Link>
        </li>
        <li
          onClick={() => setMenu("recipe")}
          className={`item ${menu === "recipe" ? "active" : ""}`}
        >
          <Link to="/recipe">Recipe</Link>
        </li>
        <li
          onClick={() => setMenu("contact")}
          className={`item ${menu === "contact" ? "active" : ""}`}
        >
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      <div className="navbar-right col-lg-5 col-md-4 col-sm-4 col-12">
        <div className="search-container col-lg-7 col-md-12 col-sm-12 col-7">
          <CiSearch className="ic_search" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="navbar-basket-icon col-lg-1 col-md-2 col-sm-2 col-1">
          <Link
            to="/cart"
            className="link"
            onClick={() => setMenu("icon-cart")}
          >
            <MdShoppingBasket
              className={`ic_basket ${menu === "icon-cart" ? "active" : ""}`}
            />
          </Link>
          <div className="dot"></div>
        </div>

        <div className="navbar-location-icon col-lg-1 col-md-6 col-sm-6 col-12">
            <FaLocationDot />
          </div>

        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
          <button onClick={() => setShowLogin(true)}>Login</button>
        </div>
      </div>
    </div>
  );
};
