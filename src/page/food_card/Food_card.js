import React, { useEffect, useState } from "react";
import "./Food_card.css";
import Chicken from "../../assets/Chicken.png";
import Fish from "../../assets/ca_dieu_hong.png";
import Shrimp from "../../assets/shrimp.png";
import Beef from "../../assets/Beef.png";
import image from "../../assets/image_food_menu.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";
import { useParams } from "react-router-dom";

export const Food_card = () => {
  const categories = ["All", "Fruits", "Vegetables", "Beverages", "Bakery"];
  const [product, setProduct] = useState("");
  const { id } = useParams();
  const foods = [
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
    { name: "Carrot Juice", price: "2.49", image: Shrimp },
  ];

  const getDataDetail = async (id) => {
    try {
      const response = await ProductService.getProductDetail(id);
      console.log("Response data:", response);
      console.log("Product ID from URL:", id);
      setProduct(response);
    } catch (error) {
      console.error("Fail load data:", error);
    }
  };
  useEffect(() => {
    if (id) {
      getDataDetail(id);
      window.scrollTo(0, 0);
    } else {
      console.error("ID is undefined");
    }
  }, [id]);

  return (
    <div>
      <div className="image-menu">
        <div className="image-menu-contents">
          <img src={image} alt="" />
        </div>
      </div>
      <div className="food-page-container col-12 mt-5">
        <div className="category-section col-2">
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
        <div className="food-grid col-10">
          {foods.map((food) => (
            <div key={food.id} className="food-card col-2">
              <img src={food.image} alt={food.name} />
              <div className="food-info">
                <h5 className="food-name">{food.name}</h5>
                <div className="food-price-and-quantity">
                  <div className="food-price">
                    <strong>Price: </strong>
                    {food.price} VND
                  </div>
                  <div className="food-quantity">
                    <strong>Quantity:</strong>
                    {food.quantity}
                  </div>
                </div>
                <div className="button-food-card">
                  <button className="bt-add-to-cart">Add to cart</button>
                  <button className="bt-buy-now">Buy now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
