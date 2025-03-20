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
      console.log("No JWT token found");
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
      } else {
        console.log("Failed to update order status:", response);
      }
    } catch (error) {
      console.error("Failed to update order status:", error.message);
    }
  };

  // Hàm hủy xóa
  const closeDeliveredSucess = () => {
    setPopupDeliveredSuccess(false);
  };

  // Call order detail
  const getOrderDetail = async (id) => {
    try {
      const response = await OrderService.getOrderDetail(id);
      setOrderData(response);
      console.log(response);
    } catch (error) {
      console.error("Fail load data:", error);
    }
  };
  useEffect(() => {
    if (id) {
      getOrderDetail(id);
      window.scrollTo(0, 0);
    } else {
      console.error("ID is undefined");
    }
  }, [id]);

  // Call info user
  useEffect(() => {
    if (!jwtToken) {
      navigate("/sign_in");
    } else {
      const getAccount = async () => {
        try {
          const response = await AccountService.account(jwtToken);
        } catch (error) {
          console.error("Error fetching account information:", error);
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
      const response = await OrderService.deleteOrderDetail(productIdToDelete);
      console.log("Response data:", response);
      setPopupDelete(false);
      setPopupDeleteSuccessful(true);
      setTimeout(() => {
        navigate("/invoice", { state: { jwtToken } });
      }, 2000);
      return "Delete successful", id;
    } catch (error) {
      console.error("Fail load data:", error);
    }
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
        <div className="shipping-info d-flex col-12 px-5 mt-4">
          <div className="col-7">
            <h2>Delivery Information :</h2>
            <div className="mt-2 font-size-for-text">
              <p>
                <strong className="mx-2">Full name :</strong>
                {orderData.summary.receiver}
              </p>
              <p>
                <strong className="mx-2">Phone number :</strong>
                {orderData.summary.phoneNumber}
              </p>
              <p>
                <strong className="mx-2">Address :</strong>
                {orderData.summary.deliveryAddress}
              </p>
              <p>
                <strong className="mx-2">Note from receiver :</strong>
                {orderData.summary.note ? orderData.summary.note : "Nothing"}
              </p>
            </div>
          </div>
          <div className="col-5 d-flex status-ship">
            <h2>Shipping Status</h2>
            <p>
              :{" "}
              <strong
                style={{ color: getStatusColor(orderData.summary.status) }}
              >
                {" "}
                {statusMap[orderData.summary.status]}
              </strong>
            </p>
          </div>
        </div>
      )}
      {/* Product List */}
      {orderData.items && (
        <div className="product-list">
          {orderData.items.map((product) => (
            <div className="product-item" key={product.id}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info font-size-for-text">
                <h3>{product.name}</h3>
                <p>
                  Price: <strong>${product.price}</strong>
                </p>
                <p>x{product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {orderData.summary && orderData.summary.status === "SHIPPED" && (
        <div className="actions d-flex justify-content-start mt-3">
          <button
            className="btn"
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
            <div className="popup">
              <div className="popup-content">
                <h5 className="info-delete">
                  Are you sure you want to cancel this order?
                </h5>
                <div className="popup-buttons">
                  <button
                    className="button-delete"
                    onClick={() => deleteOrderDetail(orderData.summary.id)}
                  >
                    Delete
                  </button>
                  <button className="button-cancel" onClick={cancelDelete}>
                    Cancel
                  </button>
                </div>
                <IoClose className="popup-close" onClick={cancelDelete} />
              </div>
            </div>
          )}

          {popupDeleteSuccessful && (
            <div className="popup">
              <div className="popup-content">
                <h5 className="info-delete" style={{ color: "green" }}>
                  You have successfully canceled this order.
                </h5>
              </div>
            </div>
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
                  width: "400px",
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
                  width: "100vw",
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
                  width: "400px",
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
                    marginTop: "20px",
                  }}
                >
                  You have successfully received the order.
                </p>
                <IoClose
                  onClick={closeDeliveredSucess}
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
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
