import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import "../order/Order.css";
import AccountService from "../../api/AccountService.js";
import CartService from "../../api/CartService.js";
import { BiSolidEditAlt } from "react-icons/bi";
import OrderService from "../../api/OrderService.js";
import { RiCoupon2Line } from "react-icons/ri";
import CouponService from "../../api/CouponService.js";
import ReactDOM from "react-dom";
import { IoCloseSharp } from "react-icons/io5";

const REACT_APP_BACKEND_API_ENDPOINT =
  process.env.REACT_APP_BACKEND_API_ENDPOINT;

export const Order = () => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [username, setUserName] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAdressError] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponId, setCouponId] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [tempSelect, setTempSelect] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [note, setNote] = useState("");
  const [pay, setPay] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();
  const [popupBuy, setPopupBuy] = useState(false);
  const [popupOrderSuccessful, setPopupOrderSuccessful] = useState(false);
  const [popupCoupon, setPopupCoupon] = useState(false);

  const [orderData, setOrderData] = useState({
    couponId: "",
    deliveryAddress: "",
    phoneNumber: "",
    receiver: "",
    note: "",
    paymentMethod: "",
    product: {},
  });

  const totalQuantity = products.reduce((sum, item) => sum + item.amount, 0);

  const NameBlur = () => {
    if (username.trim() === "") {
      setUserNameError("Please enter your full name");
    } else if (username.length < 4) {
      setUserNameError("The full name must be at least 4 characters");
    } else if (username.length > 100) {
      setUserNameError("The full name must be less than 100 characters");
    } else if (!/^[\p{L}\s]+$/u.test(username)) {
      setUserNameError("Please enter only alphabetic characters");
    } else {
      setUserNameError("");
    }
  };

  const PhoneBlur = () => {
    if (phone.trim() === "") {
      setPhoneError("Please enter your phone number");
    } else if (phone.length < 10 || phone.length > 10) {
      setPhoneError("Your phone number must be 10 digits");
    } else if (!/^\d+$/.test(phone)) {
      setPhoneError("Your phone number just only number");
    } else if (!/^0/.test(phone)) {
      setPhoneError("Phone number must start with 0");
    } else {
      setPhoneError("");
    }
  };

  const AddressBlur = () => {
    if (address.trim() === "") {
      setAdressError("Please enter your address");
    } else {
      setAdressError("");
    }
  };

  // Close popup delete
  const cancelBuy = () => {
    setPopupBuy(false);
  };

  //Delivery Address
  const AddressChange = (e) => {
    const { value } = e.target;
    setAddress(value);
    setOrderData((preState) => ({ ...preState, deliveryAddress: value }));
  };

  // Phone
  const PhoneChange = (e) => {
    const { value } = e.target;
    setPhone(value);
    setOrderData((preState) => ({ ...preState, phoneNumber: value }));
  };

  // Receiver
  const ReceiverChange = (e) => {
    const { value } = e.target;
    setUserName(value);
    setOrderData((preState) => ({ ...preState, receiver: value }));
  };

  // Receive note
  const NoteChange = (e) => {
    const { value } = e.target;
    setNote(value);
    setOrderData((preState) => ({ ...preState, note: value }));
  };

  // PaymentMethod
  const PayChange = (e) => {
    const { value } = e.target;
    setPay(value);
    setPaymentMethod(value);
    setOrderData((preState) => ({ ...preState, paymentMethod: value }));
  };

  const handleTempCouponSelect = (couponId) => {
    setTempSelect(couponId);
    setPopupCoupon(true);
  };

  const handleConfirmCoupon = () => {
    setSelectedCouponId(tempSelect);
    setOrderData((preState) => ({
      ...preState,
      couponId: tempSelect,
    }));
    getCouponID(tempSelect);
    setPopupCoupon(false);
  };

  const openPopupCoupon = async () => {
    if (!jwtToken) {
      alert("You need to signin");
    } else {
      try {
        const response = await CouponService.getAllCoupon();
        setCoupons(response);
        setPopupCoupon(true);
      } catch (error) {}
    }
  };

  const getCouponID = async (selectedCouponId) => {
    if (!jwtToken) {
      alert("You need to signin");
    } else {
      try {
        const response = await CouponService.getCouponDetail(selectedCouponId);
        setCoupon(response);
        setPopupCoupon(false);
      } catch (error) {}
    }
  };

  const handleProceedToPayment = () => {
    NameBlur();
    PhoneBlur();
    AddressBlur();
    if (
      usernameError ||
      phoneError ||
      addressError ||
      !username ||
      !address ||
      !phone
    ) {
      setPopupBuy(false);
      return;
    }
    if (!pay) {
      alert("Please select a payment method.");
      return;
    }
    setPopupBuy(true);
  };

  // Call user info
  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== null) {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
          setEmail(response.email);
          setPhone(response.phone);
          setAddress(response.address);
          setOrderData((prev) => ({
            ...prev,
            receiver: response.username,
            phoneNumber: response.phone,
            deliveryAddress: response.address,
          }));
          setPopupBuy(false);
        } catch (error) {}
      } else {
        setUserName("");
        setEmail("");
        setPhone("");
        setAddress("");
      }
    };
    getAccount();
  }, [jwtToken]);

  // Call all product in cart
  const getAllProduct = async () => {
    try {
      const response = await CartService.getAllInCart();
      if (Array.isArray(response)) {
        setProducts(response);
        const formattedProducts = response.reduce((acc, item) => {
          acc[item.product.id] = item.amount;
          return acc;
        }, {});
        setOrderData((prev) => ({ ...prev, product: formattedProducts }));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllProduct();
    window.scrollTo(1, 0);
  }, []);

  // Calculator total
  const updateTotals = (items) => {
    let total = 0;
    items.forEach((item) => {
      const price =
        item.product.salePercent > 0
          ? item.product.price -
            (item.product.price * item.product.salePercent) / 100
          : item.product.price;
      total += price * item.amount;
    });
    setTotalPrice(total.toFixed(2));
  };

  useEffect(() => {
    updateTotals(products);
  }, [products]);

  const createOrder = async () => {
    try {
      const response = await OrderService.createOrder(orderData, jwtToken);
      if (response) {
        return response;
      } else {
        throw new Error("Failed to create order. No ID returned.");
      }
    } catch (error) {
      throw error;
    }
  };

  const getURLPaypal = async (orderId) => {
    try {
      const response = await OrderService.getURLPaypal(orderId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getURLVNPay = async (orderId) => {
    try {
      const response = await OrderService.getURLVNPay(orderId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paypaltoken, setPaypaltoken] = useState(null);

  const handleCreateOrderAndPayment = async () => {
    try {
      setPaymentMethod("PAYPAL");
      orderData.paymentMethod = "PAYPAL";
      const createdOrder = await createOrder(orderData, jwtToken);
      const orderId = createdOrder.id;
      if (!orderId) {
        throw new Error("Order ID is missing in the response from createOrder");
      }
      const paymentUrl = await getURLPaypal(orderId, jwtToken);
      if (paymentUrl) {
        window.open(paymentUrl, "_blank");
        const urlParams = new URLSearchParams(paymentUrl.split("?")[1]);
        setPaypaltoken(urlParams.get("token")); // Save the token
        setIsModalOpen(true); // Open modal when PayPal is initiated

        return orderId;
      } else {
        throw new Error("Payment URL is undefined");
      }
    } catch (error) {
      throw error;
    }
  };

  const REACT_APP_DEPLOY_ENDPOINT = process.env.REACT_APP_DEPLOY_ENDPOINT;
  const handleCloseModal = () => {
    window.location.href = `${REACT_APP_DEPLOY_ENDPOINT}/invoice`;
    setIsModalOpen(false);
  };

  const handleOnApprove = async () => {
    try {
      const captureResult = await OrderService.handleApprove(paypaltoken);
      if (captureResult.status === "RECEIVED") {
        alert("Payment completed successfully!");
        window.location.href = `${REACT_APP_DEPLOY_ENDPOINT}/invoice`;
      } else {
        alert("Payment failed or not completed.");
      }
    } catch (error) {
      alert("Payment failed or not completed.");
    }
  };

  // const handleVNPayPayment = async () => {
  //   try {
  //     setPaymentMethod("VNPAY");
  //     orderData.paymentMethod = "VNPAY";
  //     const createdOrder = await createOrder(orderData, jwtToken);
  //     const orderId = createdOrder.id;
  //     if (!orderId) {
  //       throw new Error("Order ID is missing in the response from createOrder");
  //     }

  //     const paymentUrl = await getURLVNPay(orderId, jwtToken);
  //     if (paymentUrl) {
  //       window.open(paymentUrl, "_blank");
  //       return orderId;
  //     } else {
  //       throw new Error("Payment URL is undefined");
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // Order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    NameBlur();
    PhoneBlur();
    AddressBlur();
    if (
      !usernameError &&
      !phoneError &&
      !addressError &&
      username &&
      address &&
      phone
    ) {
      setOrderData((prev) => ({
        ...prev,
        couponId: couponId,
        deliveryAddress: address,
        phoneNumber: phone,
        receiver: username,
        note: note,
        paymentMethod: paymentMethod,
      }));

      try {
        await OrderService.createOrder(orderData, jwtToken);
        setPopupBuy(false);
        setPopupOrderSuccessful(true);
        setTimeout(() => {
          navigate("/invoice", { state: { jwtToken } });
          window.location.reload();
        }, 2500);
      } catch (error) {
        alert("Failed to create order.");
      }
    }
  };

  return (
    <>
      <div className="checkout-wrapper py-2 ">
        <div className="container-xxl">
          <div className="row  general-order">
            {/* Part left start */}
            <div className="checkout-form-wrapper col-12 col-md-4 p-3 box">
              <div className="checkout-left-data">
                <h3 className="website-name text-center mb-4">
                  CULINARY CONNECT
                </h3>
                <div className="col-12 d-flex">
                  <strong className="col-9">
                    <p className="font-size-top my-3">Customer Information: </p>
                  </strong>
                  <div className="col-3 d-flex justify-content-end align-items-center">
                    <Link to="/edit_profile">
                      <BiSolidEditAlt className="ic_edit_order my-3" />
                    </Link>
                  </div>
                </div>

                <div className="info-customer">
                  {/* Name start */}
                  <div className="form-group">
                    <label htmlFor="name">
                      <strong className="input-name">Customer name :</strong>
                    </label>
                    <input
                      type="text"
                      className={`form-control input-checkout-infor`}
                      id="receiver"
                      placeholder="Enter your name"
                      value={username}
                      onChange={ReceiverChange}
                      onBlur={NameBlur}
                    />
                  </div>
                  {usernameError && (
                    <p style={{ color: "red", fontSize: "0.9em" }}>
                      {usernameError}
                    </p>
                  )}

                  {/* Name end */}

                  {/* Email start */}
                  <div className="form-group mt-4">
                    <label htmlFor="email">
                      <strong className="input-name">Email address :</strong>
                    </label>
                    <input
                      type="email"
                      className={`form-control input-checkout-infor `}
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      readOnly
                    />
                  </div>
                  {/* Email end */}

                  {/* Phone number start */}
                  <div className="form-group mt-4">
                    <label htmlFor="phoneNumber">
                      <strong className="input-name">Phone number :</strong>
                    </label>
                    <input
                      type="text"
                      className={`form-control input-checkout-infor`}
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={PhoneChange}
                      onBlur={PhoneBlur}
                    />
                  </div>
                  {phoneError && (
                    <p style={{ color: "red", fontSize: "0.9em" }}>
                      {phoneError}
                    </p>
                  )}
                  {/* Phone number end */}

                  {/* Shipping Address start */}
                  <div className="form-group mt-4">
                    <label htmlFor="deliveryAddress">
                      <strong className="input-name">Address :</strong>
                    </label>
                    <input
                      type="text"
                      className={`form-control input-checkout-infor`}
                      id="deliveryAddress"
                      placeholder="Enter your address"
                      value={address}
                      onChange={AddressChange}
                      onBlur={AddressBlur}
                    />
                  </div>
                  {addressError && (
                    <p style={{ color: "red", fontSize: "0.9em" }}>
                      {addressError}
                    </p>
                  )}
                  {/* Shipping Address end */}

                  {/* Note start */}
                  <div className="form-group-note mt-4">
                    <label htmlFor="">
                      <strong className="input-name">Note :</strong>
                    </label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={NoteChange}
                      className="form-control-note input-note mt-1"
                      placeholder="If you have any special requests, please write them here."
                    ></textarea>
                  </div>

                  {/* Note end */}
                </div>

                {/* Payment method start */}

                {/* Payment method end */}

                {/* Button start */}
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="col-5 ">
                      <Link to="/Cart" className="button-go-back px-2 py-1">
                        <div className="link button-go-to-cart">
                          <button>
                            <BiArrowBack className="m-lg-2 link" />
                            Go to Cart
                          </button>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Button end */}
              </div>
            </div>
            {/* Part left end */}

            {/* Part right start */}
            <div className="col-12 col-md-7 offset-1 bg-white box">
              {products.map((item, index) => (
                <div className="border-bottom mt-4 mb-3 col-12" key={index}>
                  <div className="d-flex gap-10 align-items-center mb-2">
                    <div className="d-flex gap-10 col-9">
                      <div className="position-relative col-2">
                        <span className="checkout-badge text-center badge text-white p-2 position-absolute">
                          <p className="text-quantity text-center">
                            {item.amount}
                          </p>
                        </span>
                        <div className="col-12">
                          <img
                            className="check-out-img"
                            src={item.product.imageUrl}
                            alt=""
                          />
                        </div>
                      </div>

                      {/* Title start */}
                      <div className="pt-3 col-5 mx-2 name-product">
                        <p className="align-item-center name-product-order">
                          <strong
                            className="mb-2 text-ellipsis"
                            style={{ fontSize: "0.8em" }}
                          >
                            {item.product.productName}
                          </strong>
                        </p>
                      </div>
                      {/* Title end */}

                      {/* Price start */}
                      <div className=" col-md-4 price-of-product d-flex flex-column align-items-start pt-3">
                        <p className="name-product-order text-ellipsis">
                          <strong
                            style={{ fontSize: "0.8em", whiteSpace: "nowrap" }}
                          >
                            {item.product.salePercent > 0 ? (
                              <>
                                <span className="original-price text-decoration-line-through me-2">
                                  ${item.product.price.toFixed(2)}
                                </span>
                                <span className="discounted-price text-danger fw-bold">
                                  $
                                  {(
                                    item.product.price -
                                    (item.product.price *
                                      item.product.salePercent) /
                                      100
                                  ).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span>${item.product.price.toFixed(2)}</span>
                            )}
                          </strong>
                        </p>
                      </div>
                      {/* Price end */}
                    </div>

                    {/* Total price start */}
                    <div className="total-price-one flex-grow-1 col-1 px-3 mb-2">
                      <h7
                        className="price-checkout"
                        style={{ fontSize: "0.8em" }}
                      >
                        <strong>
                          $
                          {item.product.salePercent > 0
                            ? (
                                (item.product.price -
                                  (item.product.price *
                                    item.product.salePercent) /
                                    100) *
                                item.amount
                              ).toFixed(2)
                            : (item.product.price * item.amount).toFixed(2)}
                        </strong>
                      </h7>
                    </div>
                    {/* Total price end */}
                  </div>
                </div>
              ))}

              <div className="total-price-end row align-items-center mt-3 col-12 mb-5">
                {/* Left spacing (optional) */}
                <div className="col-md-5 d-none d-md-block"></div>

                {/* Total price container */}
                <div className="col-12 col-md-7 d-flex align-items-center justify-content-end gap-2">
                  <h4 className="total mb-0 text-muted">
                    <p style={{ color: "#a1a1a1" }}>
                      Total price ({totalQuantity}{" "}
                      {totalQuantity > 1 ? "items" : "item"}):
                    </p>
                  </h4>
                  <h5 className="total-price mb-0">
                    <strong>$ {totalPrice}</strong>
                  </h5>
                </div>
              </div>

              <hr className="mt-2" />

              {/* Coupon start */}
              <div className="py-4 total-coupon d-flex justify-content-between align-items-center mt-2">
                <div>
                  <h4 className="total">
                    <RiCoupon2Line
                      style={{
                        color: "tomato",
                        fontSize: "20px",
                        marginBottom: "5px",
                        marginRight: "5px",
                      }}
                    />
                    <strong style={{ color: "black" }}>
                      Culinary Connect Coupon:{" "}
                    </strong>
                  </h4>
                </div>

                <div>
                  <button
                    onClick={openPopupCoupon}
                    style={{
                      fontSize: "0.9em",
                      background: "#159cfc",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      marginBottom: "5px",
                      borderRadius: "17px",
                    }}
                  >
                    Choose coupon
                  </button>
                </div>
              </div>
              {/* Coupon end */}

              <hr className="mt-2" />

              {/* Payment start */}
              <div className="total-amount d-flex justify-content-between align-items-center py-4 col-12">
                <div className="d-flex col-12">
                  <h4 className="total col-3">
                    <strong>Payment Method : </strong>
                  </h4>

                  {/* COD start */}
                  <div class="form-check col-4">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="COD"
                      value="COD"
                      checked={pay === "COD"}
                      onChange={PayChange}
                    />
                    <label class="form-check-label" for="cod">
                      <h5 className="payment col-12">
                        <p style={{ fontSize: "0.9em", fontWeight: "500" }}>
                          COD (Cash on Delivery)
                        </p>
                      </h5>
                    </label>
                  </div>
                  {/* COD end */}

                  {/* Banking start */}
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="PAYPAL"
                      value="PAYPAL"
                      checked={pay === "PAYPAL"}
                      onChange={PayChange}
                    />
                    <label class="form-check-label" for="paypal">
                      <p style={{ fontSize: "0.85em", fontWeight: "500" }}>
                        PAYPAL
                      </p>
                    </label>
                  </div>
                  {/* <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="VNPAY"
                      value="VNPAY"
                      checked={pay === "VNPAY"}
                      onChange={PayChange}
                    />
                    <label class="form-check-label" for="banking">
                      <p style={{ fontSize: "0.85em", fontWeight: "500" }}>
                        VNPAY
                      </p>
                    </label>
                  </div> */}
                  {/* Banking end */}
                </div>
              </div>
              {/* Payment end */}

              <hr className="mt-2" />

              <div>
                {/* Subtotal */}
                <div
                  className="d-flex justify-content-between align-items-center col-12 font-size-default"
                  style={{ paddingTop: "15px", paddingBottom: "8px" }}
                >
                  <div className="w-100 d-flex">
                    <div className="w-50 text-start">
                      <p>Subtotal: </p>
                    </div>
                    <div className="w-50 d-flex justify-content-end">
                      <p>
                        <strong>${totalPrice}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coupon Discount */}
                <div
                  className="d-flex justify-content-between align-items-center col-12 font-size-default"
                  style={{ paddingBottom: "8px" }}
                >
                  <div className="w-100 d-flex">
                    <div className="w-50 text-start">
                      <p>Total coupon discount: </p>
                    </div>
                    <div className="w-50 d-flex justify-content-end">
                      <p>
                        <strong>
                          {coupon && coupon.salePercent > 0 ? (
                            <>
                              <span style={{ color: "red" }}>
                                - {coupon.salePercent}%
                              </span>
                              {` (-$${
                                (totalPrice * coupon.salePercent) / 100
                              })`}
                            </>
                          ) : (
                            "$0"
                          )}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Payment */}
                <div className="d-flex justify-content-between align-items-center col-12 font-size-default">
                  <div className="w-100 d-flex">
                    <div className="w-50 text-start">
                      <p>Total payment: </p>
                    </div>
                    <div className="w-50 d-flex justify-content-end">
                      <p
                        style={{
                          color: "tomato",
                          fontSize: "1.8em",
                          fontWeight: "500",
                        }}
                      >
                        $
                        {coupon && coupon.salePercent > 0
                          ? totalPrice - (totalPrice * coupon.salePercent) / 100
                          : totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-5 mt-3 button-order">
                <button
                  className="d-flex justify-content-end mb-3"
                  type="submit"
                  style={{ borderRadius: "5px", padding: "10px" }}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </button>
              </div>

              {isModalOpen && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h4>Payment Confirmation</h4>
                    <p>Click submit when you are done with the payment.</p>
                    <button
                      onClick={handleOnApprove}
                      style={{ backgroundColor: "#28a745", color: "#fff" }}
                    >
                      Submit
                    </button>
                    <button
                      onClick={handleCloseModal}
                      style={{ backgroundColor: "#dc3545", color: "#fff" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {popupBuy &&
                ReactDOM.createPortal(
                  <>
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(0.05em)",
                        WebkitBackdropFilter: "blur(6px)",
                        zIndex: 999,
                      }}
                      onClick={cancelBuy}
                    ></div>

                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        padding: "25px",
                        width: "400px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                        zIndex: 1000,
                        textAlign: "center",
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: "20px",
                          color: "#333",
                          fontWeight: "bold",
                          fontSize: "1.15em",
                        }}
                      >
                        Confirm Your Order
                      </h3>
                      <p
                        style={{
                          marginTop: "-10px",
                          color: "#555",
                          fontSize: "0.9em",
                        }}
                      >
                        Are you sure you want to purchase this product?
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          marginTop: "15px",
                        }}
                      >
                        <button
                          onClick={handleSubmitOrder}
                          style={{
                            flex: "1",
                            padding: "5px",
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "0.8em",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#05a810")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#2d9631")
                          }
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelBuy}
                          style={{
                            flex: "1",
                            padding: "10px",
                            backgroundColor: "#b80707",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "0.9em",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#c92e2e")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#db0000")
                          }
                        >
                          No
                        </button>
                      </div>
                      <IoCloseSharp
                        className="ic-close"
                        onClick={cancelBuy}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          cursor: "pointer",
                          color: "#555",
                        }}
                      />
                    </div>
                  </>,
                  document.body
                )}

              {popupOrderSuccessful &&
                ReactDOM.createPortal(
                  <>
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(0.05em)",
                        WebkitBackdropFilter: "blur(6px)",
                        zIndex: 999,
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
                        padding: "35px",
                        width: "400px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                        zIndex: 1000,
                        textAlign: "center",
                      }}
                    >
                      <svg
                        className="checkmark"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 52 52"
                        style={{
                          transform: "scale(0.3)",
                          animation: "scaleIn 0.5s ease-in-out both",
                          justifyContent: "space-between",
                        }}
                      >
                        <circle
                          className="checkmark__circle"
                          cx="26"
                          cy="26"
                          r="25"
                          fill="none"
                          stroke="#4caf50"
                          strokeWidth="4"
                          strokeMiterlimit="10"
                        />
                        <path
                          className="checkmark__check"
                          fill="none"
                          stroke="#4caf50"
                          strokeWidth="4"
                          strokeMiterlimit="10"
                          d="M14 26l7 7 15-15"
                        />
                      </svg>
                      <p
                        style={{
                          marginTop: "20px",
                          color: "green",
                          fontSize: "1.1em",
                          fontWeight: "600",
                        }}
                      >
                        Your order has been successfully placed
                      </p>
                    </div>
                  </>,
                  document.body
                )}

              {popupCoupon && (
                <>
                  {/* Lớp nền mờ */}
                  <div
                    className="coupon-popup-overlay"
                    onClick={() => setPopupCoupon(false)}
                  ></div>

                  {/* Nội dung popup */}
                  <div className="coupon-popup-container">
                    <h2 className="coupon-popup-title d-flex justify-content-center align-items-center text-center">
                      Choose
                      <p className="text-of-header-coupon mx-1">
                        CULINARY CONNECT
                      </p>
                      Coupon
                    </h2>

                    {/* Danh sách coupon có thanh cuộn */}
                    <div
                      className="coupon-list col-12"
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        paddingRight: "10px",
                      }}
                    >
                      {coupons.length > 0 ? (
                        coupons.map((item, index) => (
                          <div
                            className={`coupon-card col-12 ${
                              totalPrice < item.minimumPrice
                                ? "disabled-coupon"
                                : ""
                            }`}
                            key={index}
                          >
                            <div className="col-3">
                              <div className="coupon-left">Free shipping</div>
                            </div>

                            <div className="coupon-details col-7 text-start">
                              <p>
                                <strong>{item.salePercent}% </strong>off
                              </p>
                              <p>Minimum order ${item.minimumPrice}</p>
                              <p className="coupon-usage">
                                Remaining coupons:{" "}
                                <strong className="usage-left">
                                  x{item.usageLeft}
                                </strong>
                              </p>
                            </div>

                            <div className="coupon-select-btn col-2 position-relative">
                              <label>
                                <input
                                  type="radio"
                                  name="payment"
                                  value={item.id}
                                  checked={tempSelect === item.id}
                                  onChange={() =>
                                    handleTempCouponSelect(item.id)
                                  }
                                  className="input-radio"
                                  disabled={totalPrice < item.minimumPrice}
                                />
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No discount codes available.</p>
                      )}
                    </div>

                    <div className="coupon-popup-footer">
                      <button
                        className="coupon-btn coupon-btn-back"
                        onClick={() => setPopupCoupon(false)}
                      >
                        Back
                      </button>
                      <button
                        className="coupon-btn coupon-btn-ok"
                        onClick={handleConfirmCoupon}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Part right end */}
          </div>
        </div>
      </div>
    </>
  );
};
