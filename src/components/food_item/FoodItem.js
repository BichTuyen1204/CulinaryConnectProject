import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FoodItem.css";
import { Link } from "react-router-dom";
import CartService from "../../api/CartService";
import AccountService from "../../api/AccountService";

const FoodItem = ({ product }) => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [username, setUserName] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const navigate = useNavigate();

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

  const addToCart = async () => {
    if (!jwtToken) {
      return;
    }
    try {
      const response = await CartService.addToCart(
        product.id,
        (product.quantity = 1)
      );
      console.log("product in cart", response);
      return response;
    } catch (error) {}
  };
  return (
    <div className="food-item">
      <Link to={`/food_detail/${product.id}`}>
        <div>
          <div className="food-item-img-container">
            <img
              className="food-item-image"
              src={product.imageUrl}
              alt={product.name}
            />
          </div>
        </div>

        <div className="food-item-info">
          <div className="food-item-name">
            <p className="">
              <strong>{product.productName}</strong>
            </p>
          </div>
          <div className="price-and-quantity">
            <p className="food-item-price">
              <strong>Price:</strong> {product.price}
            </p>
            <p className="food-item-quantity">
              <strong className="link">Quantity:</strong>{" "}
              {product.availableQuantity}
            </p>
          </div>
        </div>
      </Link>

      {accountRole === "CUSTOMER" && (
        <div className="button-in-item">
          <button className="button-addtocart" onClick={addToCart}>
            Add to cart
          </button>
          <button className="button-buynow">Buy now</button>
        </div>
      )}
      {accountRole === "" && (
        <div className="button-in-item">
          <button className="button-addtocart" onClick={addToCart}>
            Add to cart
          </button>
          <button className="button-buynow">Buy now</button>
        </div>
      )}
      {accountRole === "ADMIN" && (
        <div className="button-in-item">
          <button className="button-addtocart">Add to cart</button>
          <button className="button-buynow">Buy now</button>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
