import React from "react";
import "./FoodItem.css";
import { Link } from "react-router-dom";

const FoodItem = ({ product }) => {
  return (
    <div className="food-item">
      <Link to={`/food_detail/${product.id}`}>
        <div className="food-item-img-container">
          <img
            className="food-item-image"
            src={product.imageUrl}
            alt={product.name}
          />
        </div>

        <div className="food-item-info">
          <div className="food-item-name link">
            <p className="">
              <strong>{product.productName}</strong>
            </p>
          </div>
          <div className="price-and-quantity">
            <p className="food-item-price">
              <strong>Price:</strong> {product.price}
            </p>
            <p className="food-item-quantity">
              <strong className="link">Quantity:</strong> {product.availableQuantity}
            </p>
          </div>
        </div>
      </Link>

      <div className="button-in-item">
        <button className="button-addtocart">Add to cart</button>
        <button className="button-buynow">Buy now</button>
      </div>
    </div>
  );
};

export default FoodItem;
