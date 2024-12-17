import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import "../order/Order.css";
import AccountService from "../../api/AccountService.js";
import CartService from "../../api/CartService.js";
import { BiSolidEditAlt } from "react-icons/bi";
import OrderService from "../../api/OrderService.js";
import { IoClose } from "react-icons/io5";

export const Order = () => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponId, setCouponId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [pay, setPay] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [popupBuy, setPopupBuy] = useState(false);
  const [salePercent, setSalePercent] = useState(null);
  const [popupOrderSuccessful, setPopupOrderSuccessful] = useState(false);

  const [orderData, setOrderData] = useState({
    couponId: "",
    deliveryAddress: "",
    phoneNumber: "",
    receiver: "",
    note: "",
    paymentMethod: "",
    product: {},
  });

  // Open popup delete
  const openModal = () => {
    setPopupBuy(true);
  };

  // Close popup delete
  const cancelBuy = () => {
    setPopupBuy(false);
  };

  // Receive idCoupon
  const IdCouponChange = (e) => {
    const { value } = e.target;
    setCouponId(value);
    setOrderData((preState) => ({ ...preState, couponId: value }));
  };

  //Delivery Address
  const Address = (value) => {
    setAddress(value);
    setOrderData((preState) => ({ ...preState, deliveryAddress: value }));
  };

  // Phone
  const Phone = (value) => {
    setPhone(value);
    setOrderData((preState) => ({ ...preState, phoneNumber: value }));
  };

  // Receiver
  const Receiver = (value) => {
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
    setOrderData((preState) => ({ ...preState, paymentMethod: value }));
  };

  //Call coupon
  // Call coupon
const getCoupon = async () => {
  try {
    if (!couponId) {
      setError("Please enter a coupon ID.");
      return;
    }
    setError("");
    const response = await OrderService.getCoupon(couponId);
    if (response) {
      const discountAmount = (totalPrice * response.salePercent) / 100;
      setCoupon(discountAmount);
      setSalePercent(response.salePercent);
    } else {
      setError("Coupon ID does not exist or is invalid.");
      return;
    }
  } catch (error) {
    console.error("Failed to fetch coupon:", error);
    setError("An error occurred while applying the coupon.");
  }
};


  const handleProceedToPayment = () => {
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
            phoneNumber: response.phone,
            deliveryAddress: response.address,
            receiver: response.username,
          }));
          setPopupBuy(false);
        } catch (error) {
          console.error("Error fetching account information:", error);
        }
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
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    getAllProduct();
    window.scrollTo(0, 0);
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

  // Order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Error: Shipping address cannot be empty!");
      return; 
    }

    setOrderData((prev) => ({
      ...prev,
      couponId: couponId,
      note: note,
      paymentMethod: pay,
    }));
    try {
      const response = await OrderService.createOrder(orderData, jwtToken);
      console.log("Order created successfully:", response);
      setPopupBuy(false);
      setPopupOrderSuccessful(true);
      setTimeout(() => {
        navigate("/invoice", { state: { jwtToken } });
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error creating order:", error);
      console.log("Order created successfully:", error.response);
      alert("Failed to create order.");
    }
  };

  return (
    <>
      <div className="checkout-wrapper py-2 ">
        <div className="container-xxl">
          <div className="row col-12">
            {/* Part left start */}
            <div className="checkout-form-wrapper col-5 p-3 box">
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

                <div>
                  {/* Name start */}
                  <div className="form-group">
                    <label htmlFor="name">
                      <strong>Customer name :</strong>
                    </label>
                    <input
                      type="text"
                      className={`form-control input-checkout-infor`}
                      id="name"
                      placeholder="Enter your name"
                      value={username}
                      readOnly
                    />
                  </div>
                  {/* Name end */}

                  {/* Email start */}
                  <div className="form-group mt-4">
                    <label htmlFor="email">
                      <strong>Email address :</strong>
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
                      <strong>Phone number :</strong>
                    </label>
                    <input
                      type="text"
                      className={`form-control input-checkout-infor`}
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      value={phone}
                      readOnly
                    />
                  </div>
                  {/* Phone number end */}

                  {/* Shipping Address start */}
                  <div className="form-group mt-4">
                    <label htmlFor="shippingAddress">
                      <strong>Shipping Address :</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control input-checkout-infor"
                      id="shippingAddress"
                      placeholder="Enter your shipping address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)} // Update the address state
                    />
                  </div>
                  {/* Shipping Address end */}


                  {/* Note start */}
                  <div className="form-group-note mt-4">
                    <label htmlFor="">
                      <strong>Note :</strong>
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

                  {/* Voucher start */}
                  <div className="form-group-voucher mt-5">
                    <strong className="font-size-top">Coupon:</strong>
                    <input
                      type="text"
                      className={`form-control-coupon input-coupon mt-1`}
                      id="phoneNumber"
                      value={couponId}
                      placeholder="Enter coupon ID"
                      onChange={IdCouponChange}
                    />
                    <button className="button-coupon mt-2" onClick={getCoupon}>
                      Choose coupon
                    </button>

                    {/* Hiển thị thông tin coupon hoặc lỗi */}
                    {salePercent && (
                      <div className="coupon-info mt-3">
                        <strong>Sale: {salePercent}%</strong>
                      </div>
                    )}
                    {error && (
                      <div className="error-message mt-3" style={{color: "red"}}>
                        <strong>{error}</strong>
                      </div>
                    )}
                  </div>
                  {/* Voucher end */}
                </div>

                {/* Payment method start */}
                <div className="mt-5">
                  <div className="w-100">
                    <h5>Payment Method :</h5>
                    <div class="form-check">
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
                        <p className="info-cod">COD ( Cash on Delivery )</p>
                      </label>
                    </div>

                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="BANKING"
                        value="BANKING"
                        checked={pay === "BANKING"}
                        onChange={PayChange}
                      />
                      <label class="form-check-label" for="banking">
                        <p className="info-cod">BANKING</p>
                      </label>
                    </div>
                  </div>
                </div>
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
            <div className="col-6 offset-1 bg-white box">
              {products.map((item, index) => (
                <div className="border-bottom mt-4 mb-3 col-12" key={index}>
                  <div className="d-flex gap-10 align-items-center mb-2">
                    <div className="d-flex gap-10 col-9">
                      <div className="position-relative col-2">
                        <span className="checkout-badge text-center badge text-white p-2 position-absolute">
                          <p className="text-quantity text-center">{item.amount}</p>
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
                      <div className="pt-3 col-8 mx-2">
                        <p className="align-item-center name-product-order">
                          <strong className="mb-2 text-ellipsis">
                            {item.product.productName}
                          </strong>
                        </p>
                      </div>
                      {/* Title end */}

                      {/* Price start */}
                      <div className="pt-3 col-3 mx-2">
                        <p className="align-item-center name-product-order">
                          <strong className="text-ellipsis">
                            {item.product.salePercent > 0 ? (
                              <>
                                <span className="original-price">
                                  ${item.product.price.toFixed(2)}
                                </span>
                                <span className="discounted-price">
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
                    <div className="flex-grow-1 col-1 px-3 mb-2">
                      <h7 className="price-checkout">
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

              <div className="d-flex justify-content-between align-items-center mt-3">
                <h4 className="total">
                  <strong>Total: </strong>
                </h4>
                <h5 className="total-price">
                  <strong>$ {totalPrice}</strong>
                </h5>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <h4 className="total">
                  <strong>Coupon: </strong>
                </h4>
                <h5 className="total-price">
                  <strong>$ {coupon > 0 ? coupon : 0}</strong>
                </h5>
              </div>

              <hr className="mt-2" />

              <div className="d-flex justify-content-between align-items-center py-2">
                <h4 className="total">
                  <strong>Total Amount: </strong>
                </h4>
                <h5 className="total-amount-price">
                  <strong>$ {totalPrice - coupon}</strong>
                </h5>
              </div>

              <div className="col-5 mt-3 button-order">
                <button type="submit" onClick={handleProceedToPayment}>
                  Proceed to Payment
                </button>
              </div>

              {popupBuy && (
                <div className="popup">
                  <div className="popup-content">
                    <h5 className="info-delete">
                      Are you sure you want to purchase this product?
                    </h5>
                    <div className="popup-buttons">
                      <button
                        className="button-delete"
                        onClick={handleSubmitOrder}
                      >
                        Buy
                      </button>
                      <button className="button-cancel" onClick={cancelBuy}>
                        Cancel
                      </button>
                    </div>
                    <IoClose className="popup-close" onClick={cancelBuy} />
                  </div>
                </div>
              )}

              {popupOrderSuccessful && (
                <div className="popup">
                  <div className="popup-content">
                    <h5 className="info-delete" style={{ color: "green" }}>
                      Your order has been successfully placed
                    </h5>
                  </div>
                </div>
              )}
            </div>
            {/* Part right end */}
          </div>
        </div>
      </div>
    </>
  );
};
