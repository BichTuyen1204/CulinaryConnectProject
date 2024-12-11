import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/customer/order";
const API_BASE_URL_2 = "http://localhost:8080/api/public/fetch";

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

  async getAllOrder(jwtToken) {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetch/all`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("All order:", response.data);
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

  async getOrderDetail(id){
    try {
      const response = await axios.get(
        `${API_BASE_URL_2}/fetch/detail/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error during API call:", error.response || error.message);
      throw error;
    }
  }
}
export default new OrderService();
