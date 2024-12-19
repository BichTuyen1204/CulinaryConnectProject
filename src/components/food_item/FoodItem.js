import React, { useContext, useEffect, useState } from "react";
import "./FoodItem.css";
import { Link, useNavigate } from "react-router-dom";
import CartService from "../../api/CartService";
import AccountService from "../../api/AccountService";
import { CartContext } from "../context/Context";

export const FoodItem = ({ product }) => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [username, setUserName] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const [popupAdd, setPopupAdd] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== "") {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
          setAccountRole(response.role);
        } catch (error) {}
      } else {
        setUserName("");
        setAccountRole("");
      }
    };
    getAccount();
  }, [jwtToken]);

  const handleAddToCart = async () => {
    if (username) {
      await addToCart(product);
      setPopupAdd(true);
      setTimeout(() => {
        setPopupAdd(false);
      }, 1000);
    } else {
      navigate("/sign_in");
    }
  };
  return (
    <div className="food-item">
      {username ? (
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
                <p className="food-item-price">
                  <strong>Price:</strong>{" "}
                  {product.salePercent > 0 ? (
                    <>
                      <span className="original-price">
                        ${product.price.toFixed(2)}
                      </span>{" "}
                      <span className="discounted-price">
                        $
                        {(
                          product.price -
                          (product.price * product.salePercent) / 100
                        ).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span>${product.price.toFixed(2)}</span>
                  )}
                </p>
              </p>

              {product.availableQuantity > 0 ? (
                <p className="food-item-quantity mt-2">
                  <strong className="link">Quantity: In stock</strong>
                </p>
              ) : product.availableQuantity === 0 ? (
                <p className="food-item-quantity mt-2">
                  <strong className="link">Quantity: Out of stock</strong>
                </p>
              ) : null}

              {product.salePercent > 0 ? (
                <p className="food-item-quantity">
                  <strong className="link">Sale:</strong> {product.salePercent}{" "}
                  %
                </p>
              ) : product.salePercent === 0 ? (
                <p className="food-item-quantity">
                  <strong className="link" style={{ color: "white" }}>
                    Sale:
                  </strong>
                </p>
              ) : null}
            </div>
          </div>
        </Link>
      ) : (
        <Link to={`/sign_in`}>
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
      )}

      {username ? (
        <div className="button-in-item">
          <button
            className="button-addtocart"
            onClick={handleAddToCart}
            disabled={product.availableQuantity === 0}
          >
            Add to cart
          </button>
          <button className="button-buynow">Buy now</button>
        </div>
      ) : (
        <div className="button-in-item">
          <button className="button-addtocart">
            <Link to="/sign_in">Add to cart</Link>
          </button>
          <button className="button-buynow">
            <Link to="/sign_in">Buy now</Link>
          </button>
        </div>
      )}
      {popupAdd && (
        <div className="popup">
          <div className="popup-content">
            <h5>Added to cart !</h5>
          </div>
        </div>
      )}
    </div>
  );
};
