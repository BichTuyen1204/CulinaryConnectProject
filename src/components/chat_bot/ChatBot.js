import React, { useState, useEffect } from "react";

const ChatBot = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));

  useEffect(() => {
    if (!jwtToken) return;
    const WS_URL = `ws://localhost:8000/ws/chat/customer?token=${jwtToken}`;
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => console.log("WebSocket Connected");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { text: data.message, sender: "bot" }]);
      console.log("sended");
    };
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.warn("WebSocket Disconnected");

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [jwtToken]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(JSON.stringify({ type: "chat", message: input }));
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      {!isOpen && <button onClick={() => setIsOpen(true)}>💬 Chat</button>}
      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <span>Chat với hỗ trợ</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
