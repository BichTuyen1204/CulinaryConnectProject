import React from "react";
import "../cart/Cart.css";
import { IoClose } from "react-icons/io5";
import Chicken from "../../assets/Chicken.png";
import Fish from "../../assets/ca_dieu_hong.png";
import Shrimp from "../../assets/shrimp.png";
import Beef from "../../assets/Beef.png";
const Cart = () => {
  const products = [
    {
      name: "Chicken Chicken Chicken Chicken Chicken Chicken Chicken",
      price: 20000,
      quantity: 54,
      image: Chicken,
    },
    { name: "Fish", price: 15000, quantity: 32, image: Fish },
    { name: "Shrimp", price: 15000, quantity: 32, image: Shrimp },
    { name: "Beef", price: 15000, quantity: 32, image: Beef },
    { name: "Fish", price: 15000, quantity: 32, image: Fish },
    { name: "Fish", price: 15000, quantity: 32, image: Fish },
    { name: "Fish", price: 15000, quantity: 32, image: Fish },
  ];

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-titile">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {products.map((item, index) => {
          return (
            <div>
              <div className="cart-items-titile cart-items-item">
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.price.toLocaleString("vi-VN")} đ</p>
                <p>{item.quantity}</p>
                <p>{(item.price * item.quantity).toLocaleString("vi-VN")} đ</p>
                <p className="ic_close"><IoClose /></p>
              </div>
              <hr />
            </div>
          );
        })}
      </div>

      <div className="part-total">
        <div className="total-quantity">
          <p><strong>Total quantity : </strong>5000</p>
        </div>
        <div className="total-price-first">
          <p><strong>Total price : </strong>5000</p>
        </div>
      </div>

      <div className="button-in-cart">
        <div className="button-go-back">
          <button>Go to menu</button>
        </div>
        <div className="button-go-checkout">
          <button>Check out</button  >
        </div>
      </div>
    </div>
  );
};
export default Cart;
