import React, { useEffect, useState, useCallback } from "react";
import "../invoice/Invoice.css";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../../api/OrderService";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ReactDOM from "react-dom";

const Invoice = () => {
  const [jwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState("ALL");
  const [loadingPayment, setLoadingPayment] = useState(null);
  const [paymentWindows, setPaymentWindows] = useState({});
  const [paymentCheckInterval, setPaymentCheckInterval] = useState(null);
  const [paypalModalOpen, setPaypalModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  const paypalOptions = {
    "client-id": "test",
    currency: "USD",
    components: "buttons",
  };

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
    { id: "DELIVERED", label: "DELIVERED" },
    { id: "CANCELLED", label: "CANCELLED" },
  ];

  const statusMap = {
    ON_CONFIRM: "ON CONFIRM",
    ON_PROCESSING: "ON PROCESSING",
    ON_SHIPPING: "ON SHIPPING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  };

  const paymentMethodMap = {
    COD: "Cash on Delivery",
    PAYPAL: "PayPal",
    VNPAY: "VNPay",
    BANKING: "Banking",
  };

  const getStatusColor = (status) => {
    return status === "CANCELLED" ? "red" : "green";
  };

  const getPaymentMethodColor = (paymentMethod) => {
    switch (paymentMethod) {
      case "COD":
        return "#ff7700";
      case "PAYPAL":
        return "#0070ba";
      case "VNPAY":
        return "#0066b3";
      case "BANKING":
        return "#6b5b95";
      default:
        return "gray";
    }
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
    } catch (error) {}
  };

  useEffect(() => {
    fetchOrders(currentTab);
  }, [currentTab]);

  const checkPaymentCompletion = useCallback(
    async (orderId, paymentWindow) => {
      if (!paymentWindow || paymentWindow.closed) {
        clearInterval(paymentCheckInterval);
        setPaymentWindows((prev) => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
        await fetchOrders(currentTab);
        return;
      }

      try {
        const currentUrl = paymentWindow.location.href;

        if (currentUrl.includes("success") || currentUrl.includes("approved")) {
          const urlParams = new URLSearchParams(currentUrl.split("?")[1]);
          const transactionId =
            urlParams.get("transactionId") || urlParams.get("token");

          if (transactionId) {
            await OrderService.handleApprove(transactionId);

            paymentWindow.close();
            clearInterval(paymentCheckInterval);
            setPaymentWindows((prev) => {
              const updated = { ...prev };
              delete updated[orderId];
              return updated;
            });
            await fetchOrders(currentTab);
          }
        }
      } catch (error) {}
    },
    [paymentCheckInterval, currentTab]
  );

  useEffect(() => {
    if (Object.keys(paymentWindows).length > 0) {
      const interval = setInterval(() => {
        Object.entries(paymentWindows).forEach(([orderId, window]) => {
          checkPaymentCompletion(orderId, window);
        });
      }, 1000);

      setPaymentCheckInterval(interval);
      return () => clearInterval(interval);
    } else if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
      setPaymentCheckInterval(null);
    }
  }, [paymentWindows, checkPaymentCompletion]);

  const handlePaypalPayment = async (orderId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingPayment(`paypal-${orderId}`);

    try {
      const paymentUrl = await OrderService.getURLPaypal(orderId);

      const paymentWindow = window.open(
        "",
        "PayPalPayment",
        "width=1000,height=700,left=100,top=100"
      );

      if (paymentWindow) {
        paymentWindow.location.href = paymentUrl;
        paymentWindow.focus();

        setPaymentWindows((prev) => ({
          ...prev,
          [orderId]: paymentWindow,
        }));
      } else {
        alert(
          "Pop-up blocked! Please enable pop-ups for this website to make payments."
        );
      }
    } catch (error) {
      console.error("Failed to get PayPal payment URL:", error);
      alert("Failed to initiate PayPal payment. Please try again.");
    } finally {
      setLoadingPayment(null);
    }
  };

  const handleVNPayPayment = async (orderId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingPayment(`vnpay-${orderId}`);

    try {
      const paymentUrl = await OrderService.getURLVNPay(orderId);

      const paymentWindow = window.open(
        "",
        "VNPayPayment",
        "width=1000,height=700,left=100,top=100"
      );

      if (paymentWindow) {
        paymentWindow.location.href = paymentUrl;
        paymentWindow.focus();
      } else {
        alert(
          "Pop-up blocked! Please enable pop-ups for this website to make payments."
        );
      }
    } catch (error) {
      console.error("Failed to get VNPay payment URL:", error);
      alert("Failed to initiate VNPay payment. Please try again.");
    } finally {
      setLoadingPayment(null);
    }
  };

  // New handlers for PayPal inline checkout
  const handlePaypalInlinePayment = (orderId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentOrderId(orderId);
    setPaypalModalOpen(true);
  };

  const closePaypalModal = () => {
    setPaypalModalOpen(false);
    setCurrentOrderId(null);
    setPaymentMessage("");
  };

  const createPaypalOrder = async () => {
    try {
      if (!currentOrderId) return;

      const paymentUrl = await OrderService.getURLPaypal(currentOrderId);
      // Extract the order ID from the PayPal URL
      const orderIdMatch = paymentUrl.match(/token=([A-Za-z0-9]+)/);
      if (orderIdMatch && orderIdMatch[1]) {
        return orderIdMatch[1];
      } else {
        throw new Error("Could not extract PayPal order ID from URL");
      }
    } catch (error) {
      console.error("Failed to create PayPal order:", error);
      setPaymentMessage(`Could not initiate PayPal Checkout: ${error.message}`);
      throw error;
    }
  };

  const onPaypalApprove = async (data) => {
    try {
      // Call your backend API to complete the payment
      await OrderService.handleApprove(data.orderID);

      setPaymentMessage("Payment completed successfully!");
      // Refresh orders to update status
      await fetchOrders(currentTab);

      // Close modal after short delay
      setTimeout(() => {
        closePaypalModal();
      }, 2000);
    } catch (error) {
      console.error("PayPal approval error:", error);
      setPaymentMessage(
        `Sorry, your transaction could not be processed: ${error.message}`
      );
    }
  };

  return (
    <div className="bg-white py-4">
      <div className="order-page">
        <div className="order-tabs flex overflow-x-auto whitespace-nowrap gap-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-invoice flex-none px-3 py-2 rounded ${
                currentTab === tab.id ? "active" : ""
              }`}
              onClick={() => setCurrentTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {orders.map((order, index) => (
          <Link to={`/order_detail/${order.id}`} key={index}>
            <div className="order-card">
              <div className="row total align-items-center">
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
                <div className="col-md-5 col-12 status text-md-end text-start">
                  <strong>Status:</strong>
                  <span
                    className="mx-1 text-truncate"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {statusMap[order.status] || "Unknown Status"}
                  </span>
                  <strong className="ms-2">Method:</strong>
                  <span
                    className="mx-1 text-truncate"
                    style={{
                      color: getPaymentMethodColor(order.paymentMethod),
                    }}
                  >
                    {paymentMethodMap[order.paymentMethod] || "Unknown"}
                  </span>
                </div>
              </div>

              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <div className="order-info row">
                    <div className="col-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="order-image"
                      />
                    </div>
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
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {order.status === "SHIPPED" && (
                    <button
                      className="btn me-2 mask-delevered"
                      style={{ backgroundColor: "tomato", color: "white" }}
                    >
                      Mark as Delivered
                    </button>
                  )}

                  {order.paymentStatus === "PENDING" &&
                    order.status !== "CANCELLED" && (
                      <>
                        {order.paymentMethod === "PAYPAL" && (
                          <button
                            className="btn me-2"
                            style={{
                              backgroundColor: "#0070ba",
                              color: "white",
                            }}
                            onClick={(e) =>
                              handlePaypalInlinePayment(order.id, e)
                            }
                            disabled={loadingPayment === `paypal-${order.id}`}
                          >
                            Pay with PayPal
                          </button>
                        )}
                        {order.paymentMethod === "PAYPAL" && (
                          <p
                            style={{
                              fontWeight: "500",
                              fontStyle: "italic",
                              fontSize: "0.7em",
                            }}
                          >
                            Please complete your payment within 1 hour of
                            placing the order.
                          </p>
                        )}

                        {order.paymentMethod === "VNPAY" && (
                          <button
                            className="btn me-2"
                            style={{
                              backgroundColor: "#0066b3",
                              color: "white",
                            }}
                            onClick={(e) => handleVNPayPayment(order.id, e)}
                          >
                            Pay with VNPay
                          </button>
                        )}
                      </>
                    )}
                </div>

                <p className="total-amount-size text-end mb-0">
                  <strong>Total Amount:</strong>{" "}
                  <span className="price-highlight">
                    $ {order.totalPrice.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </Link>
        ))}

        {orders.length === 0 && (
          <p className="text-center">No orders available</p>
        )}
      </div>

      {/* PayPal Modal */}
      {paypalModalOpen &&
        currentOrderId &&
        ReactDOM.createPortal(
          <div className="paypal-modal-overlay">
            <div className="paypal-modal-content">
              <button className="close-button" onClick={closePaypalModal}>
                ×
              </button>
              <h3>Complete Your PayPal Payment</h3>
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "pay",
                  }}
                  createOrder={createPaypalOrder}
                  onApprove={onPaypalApprove}
                  onError={(err) => {
                    setPaymentMessage(`Error: ${err.message}`);
                  }}
                />
              </PayPalScriptProvider>
              {paymentMessage && (
                <div
                  className={`payment-message ${
                    paymentMessage.includes("successfully")
                      ? "success"
                      : "error"
                  }`}
                >
                  {paymentMessage}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Invoice;
