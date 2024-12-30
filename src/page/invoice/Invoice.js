import React, { useEffect, useState } from "react";
import "../invoice/Invoice.css";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../../api/OrderService";

const Invoice = () => {
  const [jwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState("ALL");

  useEffect(() => {
    if (!sessionStorage.getItem("cartPageReloaded")) {
      sessionStorage.setItem("cartPageReloaded", "true");
      window.location.reload();
    }
  }, []);

  const tabs = [
    { id: "ALL", label: "ALL" },
    { id: "ON_CONFIRM", label: "ON CONFIRM" },
    { id: "ON_PROCESSING", label: "ON PROCESSING" },
    { id: "ON_SHIPPING", label: "ON SHIPPING" },
    { id: "SHIPPED", label: "SHIPPED" },
    { id: "CANCELLED", label: "CANCELLED" },
  ];

  const statusMap = {
    ON_CONFIRM: "ON CONFIRM",
    ON_PROCESSING: "ON PROCESSING",
    ON_SHIPPING: "ON SHIPPING",
    SHIPPED: "SHIPPED",
    CANCELLED: "CANCELLED",
  };

  const getStatusColor = (status) => {
    return status === "CANCELLED" ? "red" : "green";
  };

  const fetchOrders = async (status) => {
    if (!jwtToken) {
      navigate("/sign_in");
      return;
    }
    try {
      let response;
      if (status === "ALL") {
        response = await OrderService.getAllOrder(jwtToken);
      } else {
        response = await OrderService.getOrdersByStatus(status, jwtToken);
      }
      const sortedOrders = [...response].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentTab);
  }, [currentTab]);

  return (
    <div className="order-page">
      <div className="order-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${currentTab === tab.id ? "active" : ""}`}
            onClick={() => setCurrentTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="order-content">
        {orders.map((order, index) => (
          <Link to={`/order_detail/${order.id}`} key={index}>
            <div className="order-card">
              <div className="col-12 d-flex total">
                <div className="order-summary col-7">
                  <p className="d-flex">
                    <strong>Date :</strong>
                    <p className="mx-1">
                      {new Date(order.date).toLocaleString()}
                    </p>
                  </p>
                </div>
                <div className="col-5 status">
                  <p className="d-flex">
                    <strong>Status : </strong>
                    <p className="mx-1">
                      <strong style={{ color: getStatusColor(order.status) }}>
                        {statusMap[order.status] || "Unknown Status"}
                      </strong>
                    </p>
                  </p>
                </div>
              </div>
              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <div className="order-info">
                    <div className="col-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="order-image"
                      />
                    </div>
                    <div className="col-9">
                      <div className="order-details">
                        <p className="order-title">{item.name}</p>
                      </div>
                      <div className="d-flex">
                        <p className="order-quantity">x{item.quantity}</p>
                        <p className="order-price">
                          $ {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <p className="total-amount-size text-end px-3">
                <strong>Total Amount:</strong>{" "}
                <span className="price-highlight">
                  $ {order.totalPrice.toLocaleString()}
                </span>
              </p>
            </div>
          </Link>
        ))}

        {orders.length === 0 && (
          <p className="text-center">No orders available</p>
        )}
      </div>
    </div>
  );
};

export default Invoice;
