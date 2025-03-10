import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";
import { MdSend } from "react-icons/md";
import { BsChatTextFill } from "react-icons/bs";

const ChatBot = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("chatMessages")) || []
  );
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));

  useEffect(() => {
    if (!jwtToken) return;

    const connectWebSocket = () => {
      const WS_URL = `wss://culcon-admin-gg-87043777927.asia-northeast1.run.app/ws/chat/customer?token=${jwtToken}`;
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("✅ WebSocket Connected");
        setIsSocketConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.sender === "staff" && data.msg) {
          try {
            const messageContent = JSON.parse(data.msg);
            const newMessage = {
              text: messageContent.message,
              sender: "staff",
              timestamp: messageContent.timestamp || Date.now(), // 🔹 Thêm timestamp
            };
            updateMessages(newMessage);
          } catch (error) {
            console.error("❌ Lỗi parse dữ liệu tin nhắn:", error);
          }
        }
      };

      ws.onerror = (error) => console.error("❌ WebSocket Error:", error);

      ws.onclose = () => {
        console.warn(
          "⚠️ WebSocket Disconnected. Đang thử kết nối lại sau 5 giây..."
        );
        setIsSocketConnected(false);
        setTimeout(connectWebSocket, 5000);
      };

      setSocket(ws);
    };

    connectWebSocket();
    return () => socket?.close();
  }, [jwtToken]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateMessages = (newMessage) => {
    setMessages((prev) => {
      const updatedMessages = [
        ...prev,
        { ...newMessage, timestamp: newMessage.timestamp || Date.now() },
      ];
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && input.trim()) {
      const messageData = {
        type: "chat",
        message: input,
        timestamp: Date.now(),
      };

      socket.send(JSON.stringify(messageData));
      updateMessages({ text: input, sender: "user", timestamp: Date.now() });
      setInput("");
    } else {
      console.warn(
        "⚠️ WebSocket chưa kết nối hoặc đang trong trạng thái không sẵn sàng."
      );
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <div className="chat-container">
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <BsChatTextFill className="ic-chat" />
        </button>
      )}
      {isOpen && (
        <div className="chat-bot">
          <div className="chat-header">
            <span>Chat Support</span>
            <button className="close-chat" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="message-container">
                <div className={`message ${msg.sender}`}>{msg.text}</div>

                <div ref={chatEndRef} />
                <p className="format-time">{formatTime(msg.timestamp)}</p>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <textarea
              ref={textareaRef}
              placeholder={"Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              className="chat-textarea"
            />
            <MdSend className="ic-send" onClick={sendMessage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
