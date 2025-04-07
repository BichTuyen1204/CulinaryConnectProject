import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT =
  process.env.REACT_APP_BACKEND_API_ENDPOINT;
const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/api/customer/order`;
const API_BASE_URL_2 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/public/fetch`;
const API_BASE_URL_3 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/payment`;

class OrderService {
  async createOrder(orderData, jwtToken) {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, orderData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getURLPaypal(orderId) {
    const jwtToken = sessionStorage.getItem("jwtToken");

    if (!orderId) {
      throw new Error("Order ID is required to fetch payment URL");
    }

    try {
      const response = await axios.get(`${API_BASE_URL_3}/get`, {
        params: { orderId },
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const paymentUrl = response.data;
      if (!paymentUrl.startsWith("https://www.sandbox.paypal.com/")) {
        throw new Error("Invalid Payment URL returned by API");
      }
      return paymentUrl;
    } catch (error) {
      throw error;
    }
  }

  async handleApprove(id) {
    const jwtToken = sessionStorage.getItem("jwtToken");

    const transactionID = id;
    try {
      const response = await axios.post(
        `${API_BASE_URL_3}/capture?transactionID=${transactionID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getURLVNPay(orderId) {
    const jwtToken = sessionStorage.getItem("jwtToken");

    if (!orderId) {
      throw new Error("Order ID is required to fetch payment URL");
    }

    try {
      const response = await axios.get(`${API_BASE_URL_3}/vnpay/get`, {
        params: { orderId },
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const paymentUrl = response.data;

      return paymentUrl;
    } catch (error) {
      throw error;
    }
  }

  async getAllOrder(jwtToken) {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetch/all`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByStatus(status, jwtToken) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch/category?orderStatus=${status}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCoupon(couponId) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${API_BASE_URL_2}/coupon?couponId=${couponId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrderDetail(id) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${API_BASE_URL}/fetch/detail?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteOrderDetail(id) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      const response = await axios.delete(`${API_BASE_URL}/cancel?id=${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async shippedOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No JWT token found");
      }
      const response = await axios.post(
        `${API_BASE_URL}/receive?id=${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
export default new OrderService();
