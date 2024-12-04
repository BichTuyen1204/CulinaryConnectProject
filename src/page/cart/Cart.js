import React, { useEffect, useState } from "react";
import "../cart/Cart.css";
import { IoClose } from "react-icons/io5";
import CartService from "../../api/CartService";
import { Link } from "react-router-dom";

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [products, setProducts] = useState([]);

  const getAllProduct = async () => {
    try {
      const response = await CartService.getAllInCart();
      if (Array.isArray(response)) {
        setProducts(response);
      } else {
        console.error("Invalid response format:", response);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const deleteProduct = async (id) => {
    try {
      const response = await CartService.deleteCart(id);
      if (response === true) {
        getAllProduct();
        console.log("Delete successful", response)
      } else {
        console.error("Error deleting product:", response);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const totalSumQuantity = () => {
    let sumQuantity = 0;
    products.forEach((item) => {
      sumQuantity += item.amount;
    });
    return sumQuantity;
  };

  useEffect(() => {
    const sumQuantity = totalSumQuantity();
    setTotalQuantity(sumQuantity);
  }, [products]);

  const totalSumPrice = () => {
    let sumPrice = 0;
    products.forEach((item) => {
      sumPrice += item.product.price * item.amount;
    });
    return sumPrice;
  };

  useEffect(() => {
    const sumPrice = totalSumPrice();
    setTotalPrice(sumPrice);
  }, [products]);

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
        <hr />
        {Array.isArray(products) && products.length > 0 ? (
          products.map((item, index) => (
            <div key={index}>
              <div className="cart-items-titile cart-items-item">
                <Link to={`/food_detail/${item.product.id}`}>
                <img
                  src={item.product.imageUrl}
                  alt={item.product.productName}
                />
                </Link>
                
                <p>{item.product.productName}</p>
                <p>{item.product.price} đ</p>
                <p>{item.amount}</p>
                <p>{item.product.price * item.amount} đ</p>
                <p className="ic_close">
                  <IoClose onClick={() => deleteProduct(item.product.id)} />
                </p>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p className="text-center">No products found</p>
        )}
      </div>

      <div className="part-total">
        <div className="total-quantity">
          <p>
            <strong>Total quantity: </strong> {totalQuantity}
          </p>
        </div>
        <div className="total-price-first">
          <p>
            <strong>Total price: </strong> {totalPrice} đ
          </p>
        </div>
      </div>

      <div className="button-in-cart">
        <div className="button-go-back">
          <button>Go to menu</button>
        </div>
        <div className="button-go-checkout">
          <button>Check out</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
