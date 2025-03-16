import axios from "axios";

const API_BASE_URL = "https://culcon-user-be-30883260979.asia-east2.run.app/api/customer/order";
const API_BASE_URL_2 = "https://culcon-user-be-30883260979.asia-east2.run.app/api/public/fetch";
const API_BASE_URL_3 = "https://culcon-user-be-30883260979.asia-east2.run.app/api/payment";

class OrderService {
  async createOrder(orderData, jwtToken) {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, orderData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log("Order successful :", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
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

      console.log("API response:", response.data);
      const paymentUrl = response.data;
      if (!paymentUrl.startsWith("https://www.sandbox.paypal.com/")) {
        throw new Error("Invalid Payment URL returned by API");
      }
      return paymentUrl;
    } catch (error) {
      console.error(
        "Error fetching payment URL:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async handleApprove(id) {
    const jwtToken = sessionStorage.getItem("jwtToken");

    const transactionID = id;
    console.log(transactionID);
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

      console.log("Payment successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during API call:", error.response ? error.response.data : error.message);
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

      console.log("API response:", response.data);
      const paymentUrl = response.data;
    
      return paymentUrl;
    } catch (error) {
      console.error(
        "Error fetching payment URL:",
        error.response?.data || error.message
      );
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
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
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
      console.error("Error during API call:", error.response || error.message);
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
      console.error("Error during API call:", error.response || error.message);
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
      console.error("Error during API call:", error.response || error.message);
      throw error;
    }
  }

  async deleteOrderDetail(id) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      const response = await axios.delete(`${API_BASE_URL}/cancel?id=${id}`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error during API call:", error.response || error.message);
      throw error;
    }
  }
}
export default new OrderService();
