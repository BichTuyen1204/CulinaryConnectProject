import React from "react";
import { useNavigate } from "react-router-dom";
import "../order_confirm/OrderConfirmation.css";

const OrderConfirmation = ({ order }) => {
  const navigate = useNavigate();

  const sampleOrder = {
    customerName: "John Doe",
    shopName: "Culinary Connect",
    totalPrice: 99.99,
    date: new Date(),
    items: [
      {
        id: 1,
        name: "Premium Coffee Beans",
        imageUrl:
          "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?fit=crop&w=300&q=80",
        price: 19.99,
        quantity: 2,
      },
      {
        id: 2,
        name: "Luxury Chocolate Box",
        imageUrl:
          "https://images.unsplash.com/photo-1600180758894-d194aad186c6?fit=crop&w=300&q=80",
        price: 30.0,
        quantity: 1,
      },
      {
        id: 3,
        name: "Organic Tea",
        imageUrl:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?fit=crop&w=300&q=80",
        price: 25.0,
        quantity: 3,
      },
    ],
  };

  const displayedOrder = order || sampleOrder;

  const handleCancelOrder = () => {
    alert("Order has been canceled.");
    navigate("/");
  };

  const handleViewDetails = () => {
    navigate("/order-details");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header text-center bg-success text-white">
          <h2>Order Confirmation</h2>
        </div>
        <div className="card-body">
          <h4 className="text-center mb-4">
            Thank you,{" "}
            <span className="" style={{ color: "tomato" }}>
              Culinary Connect
            </span>{" "}
            !
          </h4>
          <p className="text-center">
            Your order from <strong>Culinary Connect</strong> has been placed
            successfully.
          </p>

          {/* Thông tin tổng tiền và ngày đặt */}
          <div className="mt-4 text-center">
            <p>
              <strong>Total Amount:</strong>{" "}
              <span className="">${displayedOrder.totalPrice.toFixed(2)}</span>
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(displayedOrder.date).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="button-both text-center mb-3">
          <button className="me-3 button-cancer">Cancel Order</button>
          <button className="button-view-detail">View Order Details</button>
        </div>
        <div className="card-footer text-center text-muted">
          Thank you for shopping with <strong>{displayedOrder.shopName}</strong>
          . We hope to see you again soon!
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
