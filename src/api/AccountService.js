import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT =
  process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/api/auth`;
const API_BASE_URL_2 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/customer`;

class AccountService {
  async register(account) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, account);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signin(account) {
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, account);
      const jwtToken = response.data.accessToken;
      sessionStorage.setItem("jwtToken", jwtToken);
    } catch (error) {
      throw error;
    }
  }

  async forgotGetOTP(email) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/forgot/otp/get?email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error during OTP request:", error);
      if (error.response && error.response.status === 500) {
        alert("Invalid email. Please try again.");
      } else {
        alert("Error sending OTP. Please try again.");
      }
      throw error;
    }
  }

  async forgotReset(id, otp, password) {
    try {
      const otpForm = { id, otp, password };
      await axios.post(`${API_BASE_URL}/forgot/reset`, otpForm);
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "Something went wrong. Please try again.";
        alert(errorMessage);
      } else if (error.request) {
        alert(
          "No response from the server. Please check your network connection."
        );
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  }

  async account(jwtToken) {
    if (!jwtToken) {
      return null;
    } else {
      try {
        const response = await axios.get(`${API_BASE_URL}/account`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        return response.data;
      } catch (error) {
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
        `https://culcon-user-be-30883260979.asia-east2.run.app/api/customer/edit/profile`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
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
        return response.data;
      }
    } catch (error) {
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
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async updatePass(updatePassword) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in again.");
      }
      const response = await axios.post(
        `${API_BASE_URL_2}/edit/password`,
        updatePassword,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
export default new AccountService();
