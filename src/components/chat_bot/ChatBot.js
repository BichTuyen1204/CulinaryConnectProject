import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";
import { MdSend } from "react-icons/md";
import { BsChatTextFill } from "react-icons/bs";

const ChatBot = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));

  useEffect(() => {
    if (!jwtToken) return;
    const WS_URL = `wss://culcon-admin-gg-87043777927.asia-northeast1.run.app/ws/chat/customer?token=${jwtToken}`;
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => console.log("✅ WebSocket Connected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.sender === "staff" && data.msg) {
        try {
          const messageContent = JSON.parse(data.msg);
          setMessages((prev) => [
            ...prev,
            { text: messageContent.message, sender: "staff" },
          ]);
        } catch (error) {
          console.error("❌ Lỗi parse dữ liệu tin nhắn:", error);
        }
      }
    };

    ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
    ws.onclose = () => console.warn("⚠️ WebSocket Disconnected");

    setSocket(ws);
    return () => ws.close();
  }, [jwtToken]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      const messageData = { type: "chat", message: input };

      socket.send(JSON.stringify(messageData));
      setMessages((prev) => [
        ...prev,
        { text: input, sender: "user"},
      ]);
      setInput("");
    }
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
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
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
