import React from "react";
import "./FoodItem.css";
import { Link } from "react-router-dom";

const FoodItem = ({ product }) => {
  return (
    <div className="food-item">
      <Link to="/food_detail">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={product.image}
          alt={product.name}
        />
      </div>
      </Link>
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

export default FoodItem;
