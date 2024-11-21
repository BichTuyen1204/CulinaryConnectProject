import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/auth";

class AccountService {
    async register(account) {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, account);
            return response.data;
        } catch (error){
            console.error("Registration failed: ", error.response ? error.response.data : error.message);
            throw error;
        }
    }
}
export default new AccountService();