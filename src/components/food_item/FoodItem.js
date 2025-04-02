import React, { useEffect, useState } from "react";
import "./FoodItem.css";
import { Link } from "react-router-dom";
import AccountService from "../../api/AccountService";

export const FoodItem = ({ product }) => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  useEffect(() => {
    console.log("Token from sessionStorage:", jwtToken);
  }, [jwtToken]);

  return (
    <div
      className="food-item"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "95%",
        opacity: product.availableQuantity === 0 ? 0.5 : 1,
        position: "relative",
        pointerEvents: product.availableQuantity === 0 ? "none" : "auto",
      }}
    >
      {jwtToken ? (
        <Link to={`/food_detail/${product.id}`}>
          <div>
            <div className="food-item-img-container">
              <img
                className="food-item-image"
                src={product.imageUrl}
                alt={product.name}
              />
              {product.availableQuantity === 0 && (
                <div
                  className="out-of-stock"
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#333",
                    color: "white",
                    padding: "10px 15px",
                    width: "100%",
                    fontSize: "0.7em",
                    fontWeight: "bold",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    textAlign: "center",
                  }}
                >
                  Out of Stock
                </div>
              )}
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
                        ${product.price.toFixed(1)}
                      </span>{" "}
                      <span className="discounted-price">
                        $
                        {(
                          product.price -
                          (product.price * product.salePercent) / 100
                        ).toFixed(1)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>${product.price.toFixed(1)}</span>
                      <span className="discounted-price"></span>
                    </>
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
            {product.availableQuantity === 0 && (
              <div
                className="out-of-stock"
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#333",
                  color: "white",
                  padding: "10px 15px",
                  width: "100%",
                  fontSize: "0.7em",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  textAlign: "center",
                }}
              >
                Out of Stock
              </div>
            )}
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
                        ${product.price.toFixed(1)}
                      </span>{" "}
                      <span className="discounted-price">
                        $
                        {(
                          product.price -
                          (product.price * product.salePercent) / 100
                        ).toFixed(1)}
                      </span>
                    </>
                  ) : (
                    <span>${product.price.toFixed(1)}</span>
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
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};
