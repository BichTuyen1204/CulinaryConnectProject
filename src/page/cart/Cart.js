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
          ? item.product.price -
            (item.product.price * item.product.salePercent) / 100
          : item.product.price;
      total += price * item.amount;
      quantity += item.amount;
    });
    setTotalPrice(total.toFixed(2));
    setTotalQuantity(quantity);
  }, [cartItems]);

  // Tăng số lượng
  const increaseQuantity = (id) => {
    const item = cartItems.find((item) => item.product.id === id);
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
    const item = cartItems.find((item) => item.product.id === id);
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
        item.product.id === id
          ? { ...item, amount: value === "" ? "" : parseInt(value, 10) }
          : item
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
        setProducts([]);
      }
    } catch (error) {}
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
      setItems((prevItems) =>
        prevItems.filter((item) => item.product.id !== productIdToDelete)
      );
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
          ? item.product.price -
            (item.product.price * item.product.salePercent) / 100
          : item.product.price;
      total += price * (item.amount || 1);
      quantity += item.amount || 1;
    });
    setTotalPrice(total.toFixed(2));
    setTotalQuantity(quantity);
  }, [items]);

  return (
    <div
      className="cart bg-white px-4 py-4"
      style={{ margin: "0 auto", overflowX: "auto" }}
    >
      <div className="cart-items">
        <div
          className="cart-items-titile"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "1em",
            borderBottom: "1px solid #ddd",
            padding: "10px 0",
            color: "#333",
          }}
        >
          <p style={{ flex: 1, textAlign: "center", fontSize: "0.85em" }}>
            Image
          </p>
          <p style={{ flex: 2, textAlign: "left", fontSize: "0.85em" }}>
            Title
          </p>
          <p style={{ flex: 1, textAlign: "center", fontSize: "0.85em" }}>
            Price
          </p>
          <p style={{ flex: 1, textAlign: "center", fontSize: "0.85em" }}>
            Quantity
          </p>
          <p style={{ flex: 1, textAlign: "center", fontSize: "0.85em" }}>
            Total
          </p>
          <p style={{ flex: 1, textAlign: "center", fontSize: "0.85em" }}>
            Remove
          </p>
        </div>
        <hr className="mt-1" />

        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.product.id}>
              <div
                className="cart-items-titile cart-items-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  gap: "10px",
                }}
              >
                {/* Image */}
                <div style={{ flex: 1, textAlign: "center" }}>
                  <Link to={`/food_detail/${item.product.id}`}>
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.productName}
                      style={{
                        maxWidth: "60px",
                        maxHeight: "60px",
                        borderRadius: "6px",
                        objectFit: "contain",
                      }}
                    />
                  </Link>
                </div>

                {/* Title */}
                <p className="mb-4 title-info" style={{ flex: 2 }}>
                  {item.product.productName}
                </p>

                {/* Price */}
                <div className="mb-4" style={{ flex: 1, textAlign: "center" }}>
                  {item.product.salePercent > 0 ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#888",
                          fontSize: "0.85em",
                        }}
                      >
                        ${item.product.price.toFixed(2)}
                      </span>{" "}
                      <span style={{ color: "#e53935", fontWeight: "bold" }}>
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

                {/* Quantity */}
                <div
                  className="d-flex input-quantity mb-4"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {/* Nút trừ */}
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    style={{
                      width: "20px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fceaea", // đỏ nhạt ban đầu
                      border: "1px solid #f44336", // viền đỏ
                      borderRadius: "50%",
                      fontWeight: "bold",
                      fontSize: "0.8em",
                      color: "#f44336", // chữ đỏ
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f28b82";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fceaea";
                      e.currentTarget.style.color = "#f44336";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.backgroundColor = "#d32f2f"; // nhấn giữ
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.backgroundColor = "#f28b82"; // thả ra
                    }}
                  >
                    −
                  </button>

                  {/* Ô nhập số lượng */}
                  <input
                    value={
                      items.find((it) => it.product.id === item.product.id)
                        ?.amount || ""
                    }
                    onChange={(e) => handleQuantityChange(item.product.id, e)}
                    onBlur={(e) => {
                      handleBlur(item.product.id, e);
                      e.currentTarget.style.border = "1px solid #ccc"; // reset về mặc định
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = "1px solid tomato"; // border cam khi focus
                    }}
                    min="1"
                    className="text-center input-change-quantity-cart bg-white"
                    style={{
                      width: "50px",
                      height: "30px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      padding: "6px",
                      fontSize: "0.9em",
                      transition: "border 0.2s ease",
                    }}
                  />

                  {/* Nút cộng */}
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    style={{
                      width: "20px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e8f5e9",
                      border: "1px solid #4caf50",
                      borderRadius: "50%",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "#388e3c",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c8e6c9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e8f5e9")
                    }
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <p className="mb-4" style={{ flex: 1, textAlign: "center" }}>
                  $
                  {item.product.salePercent > 0
                    ? (
                        (item.product.price -
                          (item.product.price * item.product.salePercent) /
                            100) *
                        (items.find((it) => it.product.id === item.product.id)
                          ?.amount || 1)
                      ).toFixed(2)
                    : (
                        item.product.price *
                        (items.find((it) => it.product.id === item.product.id)
                          ?.amount || 1)
                      ).toFixed(2)}
                </p>

                {/* Remove */}
                <p
                  className="ic_close"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <IoClose
                    className="ic_remove mb-4"
                    style={{
                      fontSize: "1.2em",
                      cursor: "pointer",
                      color: "#888",
                      transition: "color 0.2s ease",
                    }}
                    onClick={() => openModal(item.product.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#f44336"; // đỏ khi hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#888"; // trở lại xám
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.color = "#d32f2f"; // đỏ đậm khi nhấn
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.color = "#f44336"; // quay lại đỏ hover
                    }}
                  />
                </p>

                {/* Popup xác nhận xoá */}
                {popupDelete && productIdToDelete === item.product.id && (
                  <div
                    className="popup-delete"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      zIndex: 999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={cancelDelete}
                  >
                    <div
                      className="popup-content-delete"
                      style={{
                        backgroundColor: "#fff",
                        padding: "30px 10px",
                        borderRadius: "12px",
                        textAlign: "center",
                        position: "relative",
                        maxWidth: "360px",
                        width: "80%",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                        zIndex: 1000,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h4
                        style={{
                          marginBottom: "10px",
                          fontWeight: "450",
                          color: "#333",
                          fontSize: "1.1rem",
                        }}
                      >
                        Are you sure you want to delete this product?
                      </h4>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "15px",
                          marginTop: "20px",
                        }}
                      >
                        <button
                          onClick={deleteProduct}
                          style={{
                            backgroundColor: "#d32f2f",
                            color: "white",
                            padding: "8px 18px",
                            border: "none",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                            fontSize: "0.8em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#b71c1c")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#d32f2f")
                          }
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelDelete}
                          style={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            padding: "5px 18px",
                            border: "none",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                            fontSize: "0.8em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1565c0")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1976d2")
                          }
                        >
                          No
                        </button>
                      </div>

                      <IoClose
                        onClick={cancelDelete}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          color: "#666",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#000")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#666")
                        }
                      />
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

      {/* Tổng kết */}
      <div
        className="part-total"
        style={{
          textAlign: "right",
          marginTop: "20px",
          fontSize: "0.95em",
          fontWeight: "500",
        }}
      >
        <p>
          <strong>Total quantity: </strong> {totalQuantity}
        </p>
        <p>
          <strong>Total price: </strong> $ {totalPrice}
        </p>
      </div>

      {/* Nút điều hướng */}
      <div
        className="button-in-cart"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/food_card">
          <div className="button-go-back">
            <button
              style={{
                padding: "10px 20px",
                fontWeight: "500",
                backgroundColor: "tomato",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Go to menu
            </button>
          </div>
        </Link>

        {products.length > 0 && (
          <div className="button-go-checkout">
            <button
              style={{
                padding: "10px 20px",
                fontWeight: "500",
                backgroundColor: "tomato",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <Link
                to="/order"
                style={{ color: "white", textDecoration: "none" }}
              >
                Check out
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
