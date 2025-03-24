import { useState, useRef, useEffect, useCallback } from "react";

const useWebSocket = (url, token, onMessageReceived) => {
  const socketRef = useRef(null); // Lưu trữ WebSocket instance
  const [isConnected, setIsConnected] = useState(false); // Trạng thái kết nối
  const [error, setError] = useState(null); // Lỗi kết nối (nếu có)

  // Tạo kết nối WebSocket và xử lý các sự kiện
  const setupWebSocket = useCallback(() => {
    if (!token) return;

    // Tạo kết nối WebSocket
    const ws = new WebSocket(`${url}?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket đã kết nối!");
      setIsConnected(true); // Cập nhật trạng thái khi kết nối thành công
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Phân tích dữ liệu từ server
        onMessageReceived(data); // Xử lý tin nhắn nhận được
      } catch (error) {
        console.error("❌ Lỗi xử lý tin nhắn:", error);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ Lỗi WebSocket:", err);
      setError(err); // Cập nhật lỗi nếu có
    };

    ws.onclose = (event) => {
      console.warn(`🛑 WebSocket đóng (Mã lỗi: ${event.code})`);
      setIsConnected(false); // Cập nhật trạng thái kết nối khi bị đóng
      setTimeout(setupWebSocket, 5000); // Tự động kết nối lại sau 5 giây
    };
  }, [url, token, onMessageReceived]);

  // Hook effect để setup WebSocket khi có token
  useEffect(() => {
    setupWebSocket();

    // Cleanup khi component unmount hoặc token thay đổi
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        setIsConnected(false);
        console.log("🛑 Đóng WebSocket...");
      }
    };
  }, [setupWebSocket]);

  // Trả về socketRef, isConnected và error
  return { socketRef, isConnected, error };
};

export default useWebSocket;
