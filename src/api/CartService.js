import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT =
  process.env.REACT_APP_BACKEND_API_ENDPOINT;
const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/api/customer`;

class CartService {
  async addToCart(id, quantity) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please login.");
      }
      const response = await axios.put(
        `${API_BASE_URL}/cart/add`,
        {},
        {
          params: { id, quantity },
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

  async updateCart(id, quantity) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please login.");
      }
      const response = await axios.put(
        `${API_BASE_URL}/cart/set`,
        {},
        {
          params: { id, quantity },
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

  async getAllInCart() {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("No JWT token found. Please login.");
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/fetch`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(id) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("No JWT token found. Please login.");
    }
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/remove`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
export default new CartService();
