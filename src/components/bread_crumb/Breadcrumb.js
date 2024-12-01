import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './Breadcrumb.css';
function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // Tách đường dẫn thành các phần
  const pathnames = pathname.split("/").filter((x) => x);

  if (pathname === "/") {
    return null;
  } if (pathname === "/profile") {
    return null;
  } if (pathname === "/edit_profile") {
    return null;
  }

  // Mapping các tên đường dẫn sang tên hiển thị
  const routeNameMap = {
    food_card: "Menu",
    recipe: "Recipe",
    cart: "Cart",
    contact: "Contact",
    food_detail: "Food detail", 
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item link">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          let displayName = routeNameMap[name];
          return isLast ? (
            <li
              key={index}
              className="breadcrumb-item active"
              aria-current="page"
            >
              {displayName}
            </li>
          ) : (
            <li key={index} className="breadcrumb-item">
              <Link to={routeTo}>{displayName}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
export default Breadcrumb;
