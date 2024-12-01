import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Thêm useLocation
import { CiSearch } from "react-icons/ci";
import { MdShoppingBasket } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountService from "../../api/AccountService";
import { Dropdown } from "react-bootstrap";

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUserName] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [showMenu, setShowMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(""); 
  const [avatarActive, setAvatarActive] = useState(false);

  const location = useLocation();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== "") {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
          setAccountRole(response.role);
        } catch (error) {
          console.error("Error fetching account information:", error);
        }
      } else {
        setUserName("");
        setAccountRole("");
      }
    };
    getAccount();
  }, [jwtToken]);

  const Logout = async () => {
    localStorage.removeItem("jwtToken");
    setUserName("");
    setAccountRole("");
    setJwtToken("");
    setShowMenu(false);
    setSelectedItem("");
    setAvatarActive(false);
  };

  const handleMenuItemClick = (item) => {
    setMenu(item);
    setAvatarActive(false);
  };

  const handleAvatarClick = () => {
    setAvatarActive(true);
  };

  return (
    <div className="navbar col-12">
      <div className="logo-navbar col-2">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      <ul className="navbar-menu col-5">
        <li
          onClick={() => handleMenuItemClick("home")}
          className={`item ${location.pathname === "/" ? "active" : ""}`}
        >
          <Link to="/">Home</Link>
        </li>
        <li
          onClick={() => handleMenuItemClick("menu")}
          className={`item ${location.pathname === "/food_card" ? "active" : ""}`}
        >
          <Link to="/food_card">Menu</Link>
        </li>
        <li
          onClick={() => handleMenuItemClick("recipe")}
          className={`item ${location.pathname === "/recipe" ? "active" : ""}`}
        >
          <Link to="/recipe">Recipe</Link>
        </li>
        <li
          onClick={() => handleMenuItemClick("contact")}
          className={`item ${location.pathname === "/contact" ? "active" : ""}`}
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
            onClick={() => handleMenuItemClick("icon-cart")}
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
              accountRole === "CUSTOMER" ? (
                <div className="user-menu">
                  <Dropdown show={showMenu} align="end">
                    <Dropdown.Toggle
                      id="dropdown-custom-components"
                      variant="link"
                      className="d-flex align-items-center p-0 border-0"
                      style={{ background: "transparent", cursor: "pointer" }}
                      onClick={() => setShowMenu(!showMenu)}                    >
                      <div
                        className={`avatar-container ${avatarActive ? "active" : ""}`}
                        onClick={handleAvatarClick}
                      >
                        <img
                          src="https://randomuser.me/api/portraits/men/1.jpg"
                          className="avatar-img"
                          alt="Avatar"
                        />
                      </div>
                    </Dropdown.Toggle>

                    {showMenu && (
                      <Dropdown.Menu className="dropdown-menu-end">
                        <Dropdown.Item
                          as={Link}
                          to="/profile"
                          onClick={() => {
                            handleMenuItemClick("profile");
                            setShowMenu(false);
                            setAvatarActive(true);
                          }}
                        >
                          Your profile
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          to="/"
                          onClick={() => {
                            Logout();
                            setShowMenu(false);
                          }}
                        >
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                </div>
              ) : accountRole === "ADMIN" ? (
                <div className="user-menu">
                  <Dropdown show={showMenu} align="end">
                    <Dropdown.Toggle
                      id="dropdown-custom-components"
                      variant="link"
                      className="d-flex align-items-center p-0 border-0"
                      style={{ background: "transparent", cursor: "pointer" }}
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      <div
                        className={`avatar-container ${avatarActive ? "active" : ""}`}
                        onClick={handleAvatarClick}
                      >
                        <img
                          src="https://randomuser.me/api/portraits/men/1.jpg"
                          className="avatar-img"
                          alt="Avatar"
                        />
                      </div>
                    </Dropdown.Toggle>

                    {showMenu && (
                      <Dropdown.Menu className="dropdown-menu-end">
                        <Dropdown.Item
                          as={Link}
                          to="/admin-dashboard"
                          onClick={() => {
                            handleMenuItemClick("admin-dashboard");
                            setShowMenu(false);
                          }}
                        >
                          Admin Dashboard
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          to="/"
                          onClick={() => {
                            Logout();
                            setShowMenu(false);
                          }}
                        >
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                </div>
              ) : (
                <></>
              )
            ) : (
              <button onClick={() => setShowLogin(true)}>Login</button>
            )}
          </>
        </nav>
      </div>
    </div>
  );
};
