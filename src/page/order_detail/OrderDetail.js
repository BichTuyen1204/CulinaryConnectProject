import React, { useEffect, useState } from "react";
import "./OrderDetail.css";
import { IoArrowBackSharp } from "react-icons/io5";
import OrderService from "../../api/OrderService";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccountService from "../../api/AccountService";
import { IoClose } from "react-icons/io5";

const OrderDetail = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState({});
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const [popupDelete, setPopupDelete] = useState(false);
  const [popupDeleteSuccessful, setPopupDeleteSuccessful] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [popupDelivered, setPopupDelivered] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [popupDeliveredSuccess, setPopupDeliveredSuccess] = useState(false);

  // Hàm mở popup
  const openDelivered = (id) => {
    setSelectedItemId(id);
    setPopupDelivered(true);
  };

  // Hàm hủy xóa
  const closeDelivered = () => {
    setPopupDelivered(false);
  };

  const accecptDelivered = async (id) => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return;
    }
    try {
      const response = await OrderService.shippedOrder(id);
      if (response && response.status === "DELIVERED") {
        setPopupDelivered(false);
        setPopupDeliveredSuccess(true);
        setTimeout(() => {
          setPopupDeliveredSuccess(false);
          navigate("/invoice");
        }, 4000);
      }
    } catch (error) {}
  };

  // Call order detail
  const getOrderDetail = async (id) => {
    try {
      const response = await OrderService.getOrderDetail(id);
      setOrderData(response);
    } catch (error) {}
  };
  useEffect(() => {
    if (id) {
      getOrderDetail(id);
      window.scrollTo(0, 0);
    }
  }, [id]);

  // Call info user
  useEffect(() => {
    if (!jwtToken) {
      navigate("/sign_in");
    } else {
      const getAccount = async () => {
        try {
          await AccountService.account(jwtToken);
        } catch (error) {
          sessionStorage.removeItem("jwtToken");
          navigate("/sign_in");
        }
      };
      getAccount();
    }
  }, [jwtToken, navigate]);

  // Delete order detail
  const deleteOrderDetail = async () => {
    try {
      await OrderService.deleteOrderDetail(productIdToDelete);
      setPopupDelete(false);
      setPopupDeleteSuccessful(true);
      setTimeout(() => {
        navigate("/invoice", { state: { jwtToken } });
      }, 2000);
      return;
    } catch (error) {}
  };

  // Open popup delete
  const openModal = (id) => {
    setPopupDelete(true);
    setProductIdToDelete(id);
    setPopupDeleteSuccessful(false);
  };

  // Close popup delete
  const cancelDelete = () => {
    setPopupDelete(false);
    setProductIdToDelete(null);
  };

  const statusMap = {
    ON_CONFIRM: "ON CONFIRM",
    ON_PROCESSING: "ON PROCESSING",
    ON_SHIPPING: "ON SHIPPING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  };

  const getStatusColor = (status) => {
    return status === "CANCELLED" ? "red" : "green";
  };

  return (
    <div className="order-detail mt-5">
      <Link to="/invoice">
        <IoArrowBackSharp />
      </Link>

      {/* Shipping Info */}
      {orderData.summary && (
        <div className="shipping-info flex-wrap d-flex col-12 px-5 mt-4">
          <div className="col-7 delivery-info">
            <h2>Delivery Information</h2>
            <div className="mt-2 font-size-for-text">
              <p>
                <strong className="mx-2">Date:</strong>
                {(() => {
                  const utcDate = new Date(orderData.summary.date);
                  utcDate.setHours(utcDate.getHours() + 7);
                  return utcDate.toLocaleString("vi-VN");
                })()}
              </p>
              <p>
                <strong className="mx-2">Payment Method:</strong>
                <strong style={{ color: "tomato" }}>
                  {orderData.summary.paymentMethod}
                  {orderData.summary.paymentMethod === "PAYPAL" ||
                  orderData.summary.paymentMethod === "VNPAY"
                    ? " - " + orderData.summary.paymentStatus
                    : ""}
                </strong>
              </p>
              <p>
                <strong className="mx-2">Full Name:</strong>
                {orderData.summary.receiver}
              </p>
              <p>
                <strong className="mx-2">Phone Number:</strong>
                {orderData.summary.phoneNumber}
              </p>
              <p>
                <strong className="mx-2">Address:</strong>
                {orderData.summary.deliveryAddress}
              </p>
              <p>
                <strong className="mx-2">Note:</strong>
                {orderData.summary.note
                  ? orderData.summary.note
                  : "No special instructions"}
              </p>
            </div>
          </div>
          <div className="col-5 d-flex flex-column align-items-start status-ship">
            <h2>Shipping Status</h2>
            <p
              className="status-text"
              style={{ color: getStatusColor(orderData.summary.status) }}
            >
              <strong>{statusMap[orderData.summary.status]}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Product List */}
      {orderData.items && (
        <div className="product-list mt-4">
          {orderData.items.map((product) => (
            <div
              className="product-item d-flex align-items-center p-3 mb-3"
              key={product.id}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image me-3"
              />
              <div className="product-info font-size-for-text">
                <h3 className="mb-1">{product.name}</h3>
                <p className="mt-3" style={{ fontSize: "0.85em" }}>
                  Price: <strong>${product.price}</strong>
                </p>
                <p className="mb-0" style={{ fontSize: "0.85em" }}>
                  Quantity: <strong>{product.quantity}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="summary-price">
        {orderData.summary && (
          <div className="coupon">
            <p className="coupon-summary" style={{ fontSize: "0.9em" }}>
              <strong>Coupon:</strong> {orderData.summary.coupon.salePercent} %
            </p>
            <p
              className="mt-1 d-flex total-price-summary"
              style={{ fontSize: "1.2em" }}
            >
              <strong>Total Price:</strong>
              <p style={{ color: "red", fontWeight: "600", marginLeft: "5px" }}>
                ${orderData.summary.totalPrice}
              </p>
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {orderData.summary && orderData.summary.status === "SHIPPED" && (
        <div className="actions d-flex justify-content-start mt-3">
          <button
            className="btn mark-as-delivered"
            style={{ backgroundColor: "tomato", color: "white" }}
            onClick={() => openDelivered(orderData.summary.id)}
          >
            Mark as Delivered
          </button>
        </div>
      )}

      {orderData.summary && (
        <div>
          {/* Action Buttons */}
          {orderData.summary.status === "ON_CONFIRM" && (
            <div className="actions">
              <button
                className="cancel-button"
                onClick={() => openModal(orderData.summary.id)}
              >
                Confirm Cancellation
              </button>
            </div>
          )}

          {popupDelete && (
            <>
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(87, 87, 87, 0.5)",
                  backdropFilter: "blur(0.05em)",
                  zIndex: "999",
                }}
                onClick={cancelDelete}
              ></div>

              {/* Popup nội dung */}
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  width: "80%",
                  maxWidth: "400px",
                  height: "150px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                  zIndex: "1000",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    marginBottom: "10px",
                    color: "#333",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                  }}
                >
                  Confirm Cancel Order
                </h3>
                <p
                  style={{
                    marginBottom: "45px",
                    color: "#555",
                    fontSize: "0.8em",
                  }}
                >
                  Are you sure you want to cancel this order?
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "25px",
                  }}
                >
                  <button
                    onClick={() => deleteOrderDetail(orderData.summary.id)}
                    style={{
                      flex: "1",
                      padding: "10px",
                      backgroundColor: "#d32f2f",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.7em",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#c62828")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#d32f2f")
                    }
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelDelete}
                    style={{
                      flex: "1",
                      padding: "10px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.7em",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1565c0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#1976d2")
                    }
                  >
                    No
                  </button>
                </div>
                <IoClose
                  onClick={cancelDelete}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    color: "#555",
                  }}
                />
              </div>
            </>
          )}

          {popupDeleteSuccessful && (
            <>
              {/* Popup nội dung */}
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "rgba(87, 87, 87, 0.5)",
                  backdropFilter: "blur(0.05em)",
                  zIndex: "999",
                }}
              ></div>
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  width: "80%",
                  maxWidth: "400px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.9)",
                  zIndex: "1000",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    marginBottom: "20px",
                    color: "green",
                    fontSize: "0.9em",
                    fontWeight: "500",
                  }}
                >
                  You have successfully canceled this order.
                </p>
              </div>
            </>
          )}

          {popupDelivered && (
            <>
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(87, 87, 87, 0.5)",
                  backdropFilter: "blur(0.05em)",
                  zIndex: "999",
                }}
                onClick={closeDelivered}
              ></div>

              {/* Popup nội dung */}
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  width: "80%",
                  maxWidth: "400px",
                  height: "150px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                  zIndex: "1000",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    marginBottom: "10px",
                    color: "#333",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                  }}
                >
                  Confirm that the order has been received
                </h3>
                <p
                  style={{
                    marginBottom: "45px",
                    color: "#555",
                    fontSize: "0.8em",
                  }}
                >
                  Have you received the order?
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "25px",
                  }}
                >
                  <button
                    onClick={() => accecptDelivered(selectedItemId)}
                    style={{
                      flex: "1",
                      padding: "10px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.7em",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "green")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "green")
                    }
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeDelivered}
                    style={{
                      flex: "1",
                      padding: "10px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.7em",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1565c0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#1976d2")
                    }
                  >
                    No
                  </button>
                </div>
                <IoClose
                  onClick={closeDelivered}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    color: "#555",
                  }}
                />
              </div>
            </>
          )}

          {popupDeliveredSuccess && (
            <>
              {/* Popup nội dung */}
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "rgba(87, 87, 87, 0.5)",
                  backdropFilter: "blur(0.05em)",
                  zIndex: "999",
                }}
              ></div>
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  width: "80%",
                  maxWidth: "400px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.9)",
                  zIndex: "1000",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    marginBottom: "20px",
                    color: "green",
                    fontSize: "0.9em",
                    fontWeight: "500",
                  }}
                >
                  You have successfully received the order.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
