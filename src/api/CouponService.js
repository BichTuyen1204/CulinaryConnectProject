import axios from "axios";

class CouponService {
  async getAllCoupon() {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("No JWT token found. Please login.");
    }
    try {
      const response = await axios.get(
        `https://culcon-customer-backend-87043777927.asia-east1.run.app/api/public/fetch/coupon/all`,
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
        `https://culcon-customer-backend-87043777927.asia-east1.run.app/api/public/fetch/coupon?couponId=${couponId}`,
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
