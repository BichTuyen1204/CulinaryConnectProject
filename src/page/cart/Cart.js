import React, { useContext, useEffect, useState } from "react";
import "../cart/Cart.css";
import { IoClose } from "react-icons/io5";
import CartService from "../../api/CartService";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../../components/context/Context";

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [popupDelete, setPopupDelete] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const { cartItems, removeFromCart, updateCart } = useContext(CartContext);

  // Tính toán tổng giá và tổng số lượng
  useEffect(() => {
    let total = 0;
    let quantity = 0;
    cartItems.forEach((item) => {
      const price =
        item.product.salePercent > 0
          ? item.product.price - (item.product.price * item.product.salePercent) / 100
          : item.product.price;
      total += price * item.amount;
      quantity += item.amount;
    });
    setTotalPrice(total.toFixed(2));
    setTotalQuantity(quantity);
  }, [cartItems]);

  // Tăng số lượng
  const increaseQuantity = (id) => {
    const item = cartItems.find(item => item.product.id === id);
    if (item.amount < item.product.availableQuantity) {
      updateCart(id, item.amount + 1);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, amount: item.amount + 1 } : item
        )
      );
    }
  };

  // Giảm số lượng
  const decreaseQuantity = (id) => {
    const item = cartItems.find(item => item.product.id === id);
    if (item.amount > 1) {
      updateCart(id, item.amount - 1);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, amount: item.amount - 1 } : item
        )
      );
    }
  };

  // Mở popup xóa
  const openModal = (id) => {
    setPopupDelete(true);
    setProductIdToDelete(id);
  };

  // Đóng popup xóa
  const cancelDelete = () => {
    setPopupDelete(false);
    setProductIdToDelete(null);
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id, e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === id ? { ...item, amount: value === "" ? "" : parseInt(value, 10) } : item
      )
    );
  };

  // Xử lý mất tiêu input
  const handleBlur = (id, e) => {
    let value = e.target.value;
    const item = items.find((item) => item.product.id === id);
    const maxQuantity = item.product.availableQuantity;

    // Kiểm tra nếu giá trị là rỗng hoặc số âm
    if (value === "" || parseInt(value, 10) <= 0) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, amount: 1 } : item
        )
      );
      updateCart(id, 1);
    } else {
      const newAmount = Math.min(parseInt(value, 10), maxQuantity);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, amount: newAmount } : item
        )
      );
      updateCart(id, newAmount);
    }
  };

  // Lấy tất cả sản phẩm trong giỏ hàng
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

  // Gọi hàm khi component mount
  useEffect(() => {
    getAllProduct();
    window.scrollTo(0, 0);
  }, []);

  // Xóa sản phẩm
  const deleteProduct = async () => {
    if (productIdToDelete) {
      removeFromCart(productIdToDelete);
      setItems((prevItems) => prevItems.filter(item => item.product.id !== productIdToDelete));
      setProductIdToDelete(null);
      setPopupDelete(false);
    }
  };

  // Khởi tạo items từ cartItems
  useEffect(() => {
    const initializedItems = cartItems.map((item) => ({
      ...item,
      amount: item.amount || 1,
    }));
    setItems(initializedItems);
  }, [cartItems]);

  // Tính toán tổng
  useEffect(() => {
    let total = 0;
    let quantity = 0;
    items.forEach((item) => {
      const price =
        item.product.salePercent > 0
          ? item.product.price - (item.product.price * item.product.salePercent) / 100
          : item.product.price;
      total += price * (item.amount || 1);
      quantity += item.amount || 1;
    });
    setTotalPrice(total.toFixed(2));
    setTotalQuantity(quantity);
  }, [items]);

  return (
    <div className="cart bg-white px-4 py-4">
      <div className="cart-items">
        <div className="cart-items-titile">
          <p>Image</p>
          <p className="title">Title</p>
          <p className="mx-4">Price</p>
          <p className="quantity">Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr className="mt-2" />
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.product.id}>
              <div className="cart-items-titile cart-items-item">
                <div className="mb-3">
                  <Link to={`/food_detail/${item.product.id}`}>
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.productName}
                    />
                  </Link>
                </div>

                <p className="mb-4 title-info">{item.product.productName}</p>
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
                    value={items.find(it => it.product.id === item.product.id)?.amount || ""}
                    onChange={(e) => handleQuantityChange(item.product.id, e)}
                    onBlur={(e) => handleBlur(item.product.id, e)}
                    min="1"
                    className="text-center input-change-quantity-cart bg-white"
                  />
                  <button
                    className="increase-quantity"
                    onClick={() => increaseQuantity(item.product.id)}
                    style={{ color: "green" }}
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
                        (items.find(it => it.product.id === item.product.id)?.amount || 1)
                      ).toFixed(2)
                    : (item.product.price * (items.find(it => it.product.id === item.product.id)?.amount || 1)).toFixed(2)}
                </p>
                <p className="ic_close">
                  <IoClose
                    className="ic_remove mb-4"
                    onClick={() => openModal(item.product.id)}
                  />
                </p>

                {popupDelete && productIdToDelete === item.product.id && (
                  <div className="popup">
                    <div className="popup-content">
                      <h5 className="info-delete">
                        Are you sure you want to delete this product?
                      </h5>
                      <div className="popup-buttons">
                        <button
                          className="button-delete"
                          onClick={deleteProduct}
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
