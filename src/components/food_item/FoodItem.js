import React from "react";
import Chicken from "../../assets/Chicken.png";
import Fish from "../../assets/ca_dieu_hong.png"; // Thêm ảnh khác nếu có
import "./FoodItem.css";

const FoodList = ({ product }) => {
  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="food-item-info">
        <div className="food-item-name">
          <p>
            <strong>{product.name}</strong>
          </p>
        </div>
        <div className="price-and-quantity">
          <p className="food-item-price">
            <strong>Price:</strong> {product.price}
          </p>
          <p className="food-item-quantity">
            <strong>Quantity:</strong> {product.quantity}
          </p>
        </div>
      </div>

      <div className="button-in-item">
        <button className="button-addtocart">Add to cart</button>
        <button className="button-buynow">Buy now</button>
      </div>
    </div>
  );
};

export default FoodList;
