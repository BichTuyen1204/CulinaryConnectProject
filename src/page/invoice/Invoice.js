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
    <div className="bg-white py-4">
      <div className="order-page">
        <div className="order-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-invoice ${currentTab === tab.id ? "active" : ""}`}
              onClick={() => setCurrentTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {orders.map((order, index) => (
          <Link to={`/order_detail/${order.id}`} key={index}>
            <div className="order-card">
              {/* Order Summary & Status */}
              <div className="row total align-items-center">
                {/* Date */}
                <div className="col-md-7 col-12 order-summary">
                  <strong>Date:</strong>
                  <span className="mx-1">
                    {(() => {
                      const utcDate = new Date(order.date);
                      utcDate.setHours(utcDate.getHours() + 7);
                      return utcDate.toLocaleString("vi-VN");
                    })()}
                  </span>
                </div>
                {/* Status */}
                <div className="col-md-5 col-12 status text-md-end text-start">
                  <strong>Status:</strong>
                  <span
                    className="mx-1 text-truncate"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {statusMap[order.status] || "Unknown Status"}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <div className="order-info row">
                    {/* Image */}
                    <div className="col-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="order-image"
                      />
                    </div>
                    {/* Product Details */}
                    <div className="col-9 info-product">
                      <p className="order-title">{item.name}</p>
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

              {/* Total Amount */}
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
