import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT =
  process.env.REACT_APP_BACKEND_API_ENDPOINT;
class CouponService {
  async getAllCoupon() {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("No JWT token found. Please login.");
    }
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/public/fetch/coupon/all`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error show product in cart: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getCouponDetail(couponId) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/public/fetch/coupon?couponId=${couponId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}
export default new CouponService();
