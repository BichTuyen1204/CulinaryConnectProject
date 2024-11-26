import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

class AccountService {
  async register(account) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, account);
      return response.data;
    } catch (error) {
      console.error(
        "Registration failed: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async signin(account) {
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, account);
      const jwtToken = response.data.accessToken;
      sessionStorage.setItem('jwtToken', jwtToken);
    } catch (error) {
      console.error(
        "Login failed: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async account(jwtToken) {
    try {
      console.log("JWT Token:", jwtToken);
      const response = await axios.get(`${API_BASE_URL}/account`,  {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }, jwtToken) ;
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching account details: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}
export default new AccountService();
