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
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [popupDelete, setPopupDelete] = useState(false);
  const [popupDeleteSuccessful, setPopupDeleteSuccessful] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

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
          setUserName(response.username);
          setEmail(response.email);
          setPhone(response.phone);
          setAddress(response.address);
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
  useEffect(() => {
    if (id) {
      deleteOrderDetail(id);
      window.scrollTo(0, 0);
    } else {
      console.error("ID is undefined");
    }
  }, [id]);

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
    CANCELLED: "CANCELLED",
  };

  return (
    <div className="order-detail mt-5">
      <Link to="/invoice">
        <IoArrowBackSharp />
      </Link>

      {/* Shipping Info */}
      <div className="shipping-info d-flex col-12 px-5 mt-4">
        <div className="col-7">
          <h2>Delivery Information :</h2>
          <div className="mt-2 font-size-for-text">
            <p>
              <strong>Full name :</strong>{username}
            </p>
            <p><strong>Phone number :</strong>{phone}</p>
            <p><strong>Address :</strong>{address}</p>
          </div>
        </div>
        {orderData.summary && (
          <div className="col-5 d-flex">
            <h2>Shipping Status</h2>
            <p >: <strong style={{color: "red"}}> {statusMap[orderData.summary.status]}</strong></p>
          </div>
        )}
      </div>
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

      {orderData.summary && (
        <div>
          {/* Action Buttons */}
          {orderData.summary.status !== "SHIPPED" &&
            orderData.summary.status !== "CANCELLED" && (
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
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
