import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdShoppingBasket } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountService from "../../api/AccountService";

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUserName] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== "") {
        try {
          const response = await AccountService.account(jwtToken);
          console.log("account:", response);
          setUserName(response.username);
          setAccountRole(response.role);
        } catch (error) {
          console.error("Error fetching account information:", error);
          console.log(error.response);
        }
      } else {
        setUserName("");
        setAccountRole("");
      }
    };
    getAccount();
  }, [jwtToken]);

  const Logout = async() => {
    localStorage.removeItem("jwtToken");
    console.log("Logout successful")
    setUserName("");
    setAccountRole("");
    setJwtToken("");
  }

  return (
    <div className="navbar col-12">
      <div className="logo-navbar col-2">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      <ul className="navbar-menu col-5">
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

      <div className="navbar-right col-5">
        <div className="search-container col-7">
          <CiSearch className="ic_search" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="navbar-basket-icon col-1">
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

        <div className="navbar-location-icon col-1">
          <FaLocationDot className="ic_location" />
        </div>

        <nav>
          <>
            {username ? (
              <p>Welcome, {username}</p>
            ) : (
              <p>Welcome, Guest</p>
            )}
            {username ? (
              <button onClick={Logout}>Logout</button>
            ) : (
              <>
                <button onClick={() => setShowLogin(true)}>Login</button>
              </>
            )}
          </>
        </nav>
      </div>
    </div>
  );
};
