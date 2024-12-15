import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdShoppingBasket } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import AccountService from "../../api/AccountService";
import { CartContext } from "../context/Context";
import CartService from "../../api/CartService";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUserName] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [imgUser, setImgUser] = useState(null);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle the search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission to navigate to food_card page
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    if (searchQuery.trim()) {
      // Navigate to food_card page with the search query as a parameter
      navigate(`/food_card?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fetch account details on page load
  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== "") {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
          setAccountRole(response.role);
          setImgUser(response.profilePictureUri);
        } catch (error) {
          console.error("Error fetching account details", error);
        }
      } else {
        setUserName("");
        setAccountRole("");
      }
    };
    getAccount();
  }, [jwtToken]);

  // Handle logout functionality
  const Logout = () => {
    sessionStorage.removeItem("jwtToken");
    setUserName("");
    setAccountRole("");
    setJwtToken("");
    navigate("/");
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
        <li className={`item ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/">Home</Link>
        </li>
        <li className={`item ${location.pathname === "/food_card" ? "active" : ""}`}>
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
        {jwtToken ? (
          <li
            onClick={() => handleMenuItemClick("invoice")}
            className={`item ${
              location.pathname === "/blog" ? "active" : ""
            }`}
          > <Link to="/blog">Blog</Link></li>
        ) : (
          null
        )}

        {jwtToken ? (
          <li
            onClick={() => handleMenuItemClick("invoice")}
            className={`item ${
              location.pathname === "/invoice" ? "active" : ""
            }`}
          >
            <Link to="/invoice">Order</Link>
          </li>
        ) : null}
      </ul>

      <div className="navbar-right col-5">
        <div className="search-container col-7">
          <form onSubmit={handleSearchSubmit}>
            <CiSearch className="ic_search" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" style={{ display: "none" }} />
          </form>
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
                {cartCount > 0 && (
                  <div className="dot text-center">{cartCount}</div>
                )}
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
                        src={
                          imgUser
                            ? imgUser
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"
                        }
                        className="avatar-img"
                        alt=""
                      />
                    </div>
                  </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  <CgProfile /> Your Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={Logout}>
                  <TbLogout /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <button onClick={() => setShowLogin(true)}>Login</button>
          )}
        </div>
      </div>
    </div>
  );
};
