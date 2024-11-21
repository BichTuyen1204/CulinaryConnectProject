import React from "react";
import "./Food_card.css";
import Chicken from "../../assets/Chicken.png";
import Fish from "../../assets/ca_dieu_hong.png";
import Shrimp from "../../assets/shrimp.png";
import Beef from "../../assets/Beef.png";
import 'bootstrap/dist/css/bootstrap.min.css';


export const Food_card = () => {
  const categories = ["All", "Fruits", "Vegetables", "Beverages", "Bakery"];
  const products = [
    { name: "Apple", price: "1.99", image: Fish, quantity: "1" },
    { name: "Banana", price: "0.99", image: Chicken },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Fresh Bread", price: "2.99", image: Beef },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
    { name: "Carrot Juice", price: "2.49", image: Shrimp }  
  ];

  return (
    <div className="product-page-container col-12 mt-5">
      <div className="category-section col-2">
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
      <div className="product-grid col-10">
        {products.map((product) => (
          <div key={product.id} className="product-card col-2">
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h5 className="product-name">{product.name}</h5>
              <div className="product-price-and-quantity">
                <div className="product-price">Price: {product.price} VND</div>
                <div className="product-quantity">Quantity: {product.quantity}</div>
              </div>
              <div className="button-product-card">
                <button className="bt-add-to-cart">Add to cart</button>
                <button className="bt-buy-now">Buy now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
