import axios from "axios";

const API_BASE_URL = "https://culcon-user-be-30883260979.asia-east2.run.app/api/auth";
const API_BASE_URL_2 = "https://culcon-user-be-30883260979.asia-east2.run.app/api/customer";

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
      sessionStorage.setItem("jwtToken", jwtToken);
      console.log("Data user: ", response);
    } catch (error) {
      console.error(
        "Login failed: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async forgotGetOTP(email) {
    try {
      // Send the email as a query parameter in the URL
      const response = await axios.post(`${API_BASE_URL}/forgot/otp/get?email=${encodeURIComponent(email)}`);
      console.log("OTP Sent: ", response);
      return response.data;
    } catch (error) {
      console.error("Error during OTP request:", error);
  
      // Check for specific error codes (500 in this case)
      if (error.response && error.response.status === 500) {
        alert("Invalid email. Please try again.");
      } else {
        alert("Error sending OTP. Please try again.");
      }
  
      // Rethrow the error to propagate it further if necessary
      throw error;
    }
  }

  async forgotReset(id, otp, password) {
    try {
      const otpForm = { id, otp, password };
      const response = await axios.post(`${API_BASE_URL}/forgot/reset`, otpForm);
      console.log(response.data); 
  
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Something went wrong. Please try again.";
        alert(errorMessage);
      } else if (error.request) {
        alert("No response from the server. Please check your network connection.");
      } else {
        alert("An error occurred: " + error.message);
      }
  
      console.error("Error:", error);
    }
  }
  
  async account(jwtToken) {
    if (!jwtToken || jwtToken.trim() === "") {
      return null;
    } else {
      try {
        const response = await axios.get(`${API_BASE_URL}/account`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        return response.data;
      } catch (error) {
        console.error("Error in setting up the request:", error.message);
        return null;
      }
    }
  }

  async updateImage(formData) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in again.");
      }
      const response = await axios.post(
        `${API_BASE_URL_2}/edit/profile/picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Update failed: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async updateInfo(data) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in again.");
      }
      const response = await axios.post(
        `${API_BASE_URL_2}/edit/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Update failed: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }


  async updateEmailOTP(email) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in again.");
      }

      const response = await axios.post(
        `${API_BASE_URL_2}/edit/email/get/otp?newEmail=${email}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        const { accountId, expireTime } = response.data;
  
        this.accountId = accountId;
  
        console.log("OTP request successful. Account ID: ", accountId);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          console.error("Error: ", error.response.data.messages);
        } else {
          console.error("Update failed: ", error.response ? error.response.data : error.message);
        }
      } else {
        console.error("Error: ", error.message);
      }
      throw error;
    }
  }
  


  async updateEmail(id, email, otp) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in again.");
      }
  
      const response = await axios.post(
        `${API_BASE_URL_2}/edit/email?accountID=${id}&newEmail=${email}&otp=${otp}`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Email updated successfully:", response.data);
        return response.data; 
      }
  
    } catch (error) {
      if (error.response) {
        console.error("Update failed: ", error.response.data || error.message);
        if (error.response.status === 400) {
          console.error("Bad request: ", error.response.data); 
        }
      } else {
        console.error("Error: ", error.message);
      }
      throw error; 
    }
  }
  
  

  async updatePass(account) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in again.");
      }
      const response = await axios.post(
        `${API_BASE_URL_2}/edit/password`,
        account,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Update failed: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}
export default new AccountService();
