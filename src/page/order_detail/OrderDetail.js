import React, { useEffect, useState } from "react";
import "./OrderDetail.css";
import { IoArrowBackSharp } from "react-icons/io5";
import OrderService from "../../api/OrderService";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();
  const [orderData, setOrderData ] = useState({});

  const getOrderDetail = async (id) => {
    try {
      const response = await OrderService.getOrderDetail(id);
      console.log("Response data:", response);
      console.log("Product ID from URL:", id);
      setOrderData(response);
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

  return (
    <div className="order-detail">   
    <IoArrowBackSharp />   
      {/* Product List */}
      <div className="product-list">
        {orderData.products.map((product) => (
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

      {/* Shipping Info */}
      <div className="shipping-info d-flex col-12">
        <div className="col-7">
          <h2>Delivery Information :</h2>
          <div className="mt-2 font-size-for-text">
            <p>
              <strong>{orderData.address.name}</strong>
            </p>
            <p>({orderData.address.phone})</p>
            <p>{orderData.address.detail}</p>
          </div>
        </div>

        <div className="col-5">
          <h2>Shipping Status :</h2>
          <div className="mt-3">
            <ul>
              {orderData.shippingSteps.map((step, index) => (
                <li key={index}>
                  <p>
                    <strong>{step.time}</strong> - {step.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions">
        <button className="cancel-button">Confirm Cancellation</button>
      </div>
    </div>
  );
};

export default OrderDetail;
