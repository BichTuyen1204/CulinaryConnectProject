import React, { useEffect, useState } from "react";
import "../cart/Cart.css";
import { IoClose } from "react-icons/io5";
import CartService from "../../api/CartService";
import { Link } from "react-router-dom";

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [popupDelete, setPopupDelete] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  useEffect(() => {
    if (!sessionStorage.getItem("cartPageReloaded")) {
      sessionStorage.setItem("cartPageReloaded", "true");
      window.location.reload();
    }
  }, []);

  // Increase
  const increaseQuantity = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === id) {
          if (item.amount >= item.product.availableQuantity) {
            return item;
          }
          const newAmount = item.amount + 1;
          updateProduct(id, newAmount);
          return { ...item, amount: newAmount };
        }
        return item;
      })
    );
  };

  // Decrease
  const decreaseQuantity = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === id && item.amount > 1) {
          const newAmount = item.amount - 1;
          updateProduct(id, newAmount);
          return { ...item, amount: newAmount };
        }
        return item;
      })
    );
  };

  // Open popup delete
  const openModal = (id) => {
    setPopupDelete(true);
    setProductIdToDelete(id);
  };

  // Close popup delete
  const cancelDelete = () => {
    setPopupDelete(false);
    setProductIdToDelete(null);
  };

  // Change input
  const handleQuantityChange = (id, e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    if (value.length < 1 && value[0] === "0") {
      value = value.slice(1);
    }
    if (value === "") {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, amount: "" } : item
        )
      );
    } else {
      const newAmount = parseInt(value, 10);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, amount: newAmount } : item
        )
      );
      updateProduct(id, newAmount);
    }
  };

  // Check input quantity
  const handleBlur = (id, e) => {
    const value = e.target.value;
    const maxQuantity = items.find((item) => item.product.id === id).product
      .availableQuantity;
    if (value === "") {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, amount: 1 } : item
        )
      );
      updateProduct(id, 1);
    } else if (parseInt(value, 10) > maxQuantity) {
      // Nếu vượt quá số lượng tồn kho, đặt lại về số lượng tối đa
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, amount: maxQuantity } : item
        )
      );
      updateProduct(id, maxQuantity);
    }
  };

  // Call all product in cart
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
    window.scrollTo(0, 0);
  }, []);

  // Delete product
  const deleteProduct = async () => {
    try {
      const response = await CartService.deleteCart(productIdToDelete);
      setProductIdToDelete(null);
      setPopupDelete(false);
      if (response === true) {
        getAllProduct();
        console.log("Delete successful", response);
      } else {
        console.error("Error deleting product:", response);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const updateProduct = async (id, quantity) => {
    try {
      const response = await CartService.updateCart(id, quantity);
      console.log("Delete successful", response);
      return response;
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const updateTotals = (items) => {
    let total = 0;
    let quantity = 0;
    items.forEach((item) => {
      const price =
        item.product.salePercent > 0
          ? item.product.price -
            (item.product.price * item.product.salePercent) / 100
          : item.product.price;
      total += price * item.amount;
      quantity += item.amount;
    });
    setTotalPrice(total.toFixed(2));
    setTotalQuantity(quantity);
  };

  useEffect(() => {
    const initializedItems = products.map((product) => ({
      ...product,
      amount: product.amount || 1,
    }));
    setItems(initializedItems);
  }, [products]);

  useEffect(() => {
    updateTotals(items);
  }, [items]);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-titile">
          <p>Image</p>
          <p>Title</p>
          <p className="mx-4">Price</p>
          <p className="quantity">Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr className="mt-2" />
        {Array.isArray(products) && products.length > 0 ? (
          items.map((item, index) => (
            <div key={index}>
              <div className="cart-items-titile cart-items-item">
                <div className="mb-3">
                  <Link to={`/food_detail/${item.product.id}`}>
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.productName}
                    />
                  </Link>
                </div>

                <p className="mb-4">{item.product.productName}</p>
                <div className="mb-4">
                  {item.product.salePercent > 0 ? (
                    <>
                      <span className="original-price">
                        ${item.product.price.toFixed(2)}
                      </span>{" "}
                      <span className="discounted-price">
                        $
                        {(
                          item.product.price -
                          (item.product.price * item.product.salePercent) / 100
                        ).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span>${item.product.price.toFixed(2)}</span>
                  )}
                </div>

                <div className="d-flex input-quantity mb-4">
                  <button
                    className="decrease-quantity"
                    onClick={() => decreaseQuantity(item.product.id)}
                  >
                    -
                  </button>
                  <input
                    value={item.amount}
                    onChange={(e) => handleQuantityChange(item.product.id, e)}
                    onBlur={(e) => handleBlur(item.product.id, e)}
                    min="1"
                    className="text-center"
                  />
                  <button
                    className="increase-quantity"
                    onClick={() => increaseQuantity(item.product.id)}
                  >
                    +
                  </button>
                </div>

                <p className="mb-4">
                  $
                  {item.product.salePercent > 0
                    ? (
                        (item.product.price -
                          (item.product.price * item.product.salePercent) /
                            100) *
                        item.amount
                      ).toFixed(2)
                    : (item.product.price * item.amount).toFixed(2)}
                </p>
                <p className="ic_close">
                  <IoClose
                    className="ic_remove mb-4"
                    onClick={() => openModal(item.product.id)}
                  />
                </p>

                {popupDelete && (
                  <div className="popup">
                    <div className="popup-content">
                      <h5 className="info-delete">
                        Are you sure you want to delete this product?
                      </h5>
                      <div className="popup-buttons">
                        <button
                          className="button-delete"
                          onClick={() => deleteProduct(item.product.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="button-cancel"
                          onClick={cancelDelete}
                        >
                          Cancel
                        </button>
                      </div>
                      <IoClose className="popup-close" onClick={cancelDelete} />
                    </div>
                  </div>
                )}
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
            <strong>Total price: </strong> $ {totalPrice}
          </p>
        </div>
      </div>

      <div className="button-in-cart">
        <Link to="/food_card">
          <div className="button-go-back">
            <button>Go to menu</button>
          </div>
        </Link>
        {products.length > 0 ? (
          <div className="button-go-checkout">
            <button>
              <Link to="/order">Check out</Link>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Cart;
