import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/customer";

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
      console.log("Add product successful:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error add product: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getAllInCart() {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("No JWT token found. Please login.");
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error show product in cart: ",
        error.response ? error.response.data : error.message
      );
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
      console.error(
        "Error show product in cart: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}
export default new CartService();
