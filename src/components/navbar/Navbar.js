import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdShoppingBasket } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountService from "../../api/AccountService";
import { Dropdown } from "react-bootstrap";
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import CartService from "../../api/CartService";

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUserName] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [showMenu, setShowMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [avatarActive, setAvatarActive] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [imgUser, setImgUser] = useState(null);

  // Call all product in cart
  const getAllProduct = async () => {
    try {
      const response = await CartService.getAllInCart();
      if (Array.isArray(response)) {
        setProducts(response);
      } else {
        console.error("Invalid response format:", response);
        setProducts([]);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const totalProduct = products.length;

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
          setImgUser(response.profilePictureUri);
        } catch (error) {
        }
      } else {
        setUserName("");
        setAccountRole("");
      }
    };
    getAccount();
  }, [jwtToken]);

  const Logout = async () => {
    sessionStorage.removeItem("jwtToken");
    setUserName("");
    setAccountRole("");
    setJwtToken("");
    setShowMenu(false);
    setSelectedItem("");
    setAvatarActive(false);
    console.log("Logout successful:");
    window.location.reload();
  };

  const handleMenuItemClick = (item) => {
    setMenu(item);
    setAvatarActive(false);
    console.log(`Clicked ${item}`);
  };

  const handleAvatarClick = () => {
    setAvatarActive(true);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowMenu(false);
      setAvatarActive(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

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
          className={`item ${
            location.pathname === "/food_card" ? "active" : ""
          }`}
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
        <li
          onClick={() => handleMenuItemClick("invoice")}
          className={`item ${location.pathname === "/invoice" ? "active" : ""}`}
        >
          <Link to="/invoice">Order</Link>
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

        <nav>
          <>
            {username ? (
              <div className="navbar-basket-icon col-1">
                <Link
                  to="/cart"
                  className="link"
                  onClick={() => handleMenuItemClick("icon-cart")}
                >
                  <MdShoppingBasket
                    className={`ic_basket ${
                      menu === "icon-cart" ? "active" : ""
                    }`}
                  />
                </Link>
                <div className="dot text-center">{totalProduct}</div>
              </div>
            ) : (
              <div></div>
            )}
          </>
        </nav>

        <nav>
          <>
            {username ? (
              <div className="navbar-location-icon col-1">
                <FaLocationDot className="ic_location" />
              </div>
            ) : (
              <div></div>
            )}
          </>
        </nav>

        <nav>
          <>
            {username ? (
              <div className="user-menu" ref={dropdownRef}>
                <Dropdown show={showMenu} align="end">
                  <Dropdown.Toggle
                    id="dropdown-custom-components"
                    variant="link"
                    className="d-flex align-items-center p-0 border-0"
                    style={{ background: "transparent", cursor: "pointer" }}
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <div
                      className={`avatar-container ${
                        avatarActive ? "active" : ""
                      }`}
                      onClick={handleAvatarClick}
                    >
                      <img
                        src={imgUser ? imgUser : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"}
                        className="avatar-img" alt=""
                      />
                    </div>
                  </Dropdown.Toggle>

                  {showMenu && (
                    <Dropdown.Menu className="dropdown-menu-end">
                      <Dropdown.Item
                        as={Link}
                        to="/profile"
                        className={`dropdown-item ${
                          location.pathname === "/profile" ? "active-link" : ""
                        }`}
                        onClick={() => {
                          handleMenuItemClick("profile");
                          setShowMenu(false);
                          setAvatarActive(true);
                        }}
                      >
                        <CgProfile style={{ marginRight: "8px" }} /> Your
                        profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/"
                        className="dropdown-item"
                        onClick={() => {
                          Logout();
                          setShowMenu(false);
                        }}
                      >
                        <TbLogout style={{ marginRight: "8px" }} /> Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)}>Login</button>
            )}
          </>
        </nav>
      </div>
    </div>
  );
};