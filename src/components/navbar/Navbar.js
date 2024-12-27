import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { CartContext } from "../context/Context";

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
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

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
    } catch (error) {}
  };
  useEffect(() => {
    getAllProduct();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (searchQuery.trim() === "") {
      navigate(`/food_card`);
    } else {
      navigate(`/food_card?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== "") {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
          setAccountRole(response.role);
          setImgUser(response.profilePictureUri);
        } catch (error) {}
      } else {
        setUserName("");
        setAccountRole("");
      }
    };
    getAccount();
  }, [jwtToken]);

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
      <div className="col-1"></div>
      <div className="logo-navbar col-2">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      <ul className="navbar-menu col-4">
        <li
          onClick={() => handleMenuItemClick("home")}
          className={`item ${location.pathname === "/" ? "active" : ""}`}
        >
          <Link to="/">Home</Link>
        </li>
        <li
          className={`item ${
            location.pathname === "/food_card" ? "active" : ""
          }`}
        >
          <Link to="/food_card">Menu</Link>
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
              location.pathname === "/invoice" ? "active" : ""
            }`}
          >
            <Link to="/invoice">Order</Link>
          </li>
        ) : null}

        {jwtToken ? (
          <li
            onClick={() => handleMenuItemClick("blog")}
            className={`item ${location.pathname === "/blog" ? "active" : ""}`}
          >
            <Link to="/blog">Blog</Link>
          </li>
        ) : null}
      </ul>

      <div className="navbar-right col-4">
        <form onSubmit={handleSubmit} className="search-container col-8">
          <CiSearch className="ic_search" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        <nav className="col-1">
          <>
            {username ? (
              <div className="navbar-basket-icon mx-1">
                <Link to="/cart" className="link">
                  <MdShoppingBasket className="ic_basket" />
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
        <nav className="col-1">
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
                        className="avatar-img"
                        src={
                          imgUser && imgUser.trim() !== ""
                            ? imgUser
                            : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                        }
                        alt="Avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
                        }}
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

      <div className="col-1"></div>
    </div>
  );
};
