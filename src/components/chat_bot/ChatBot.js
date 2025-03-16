import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChatBot.css";
import { MdSend } from "react-icons/md";
import { BsChatTextFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AccountService from "../../api/AccountService";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken) {
      navigate("/sign_in");
      return;
    }
    const fetchAccount = async () => {
      try {
        const response = await AccountService.account(jwtToken);
        setIdUser(response.id);
      } catch (error) {
        console.error("Error fetching account information:", error);
        sessionStorage.removeItem("jwtToken");
        navigate("/sign_in");
      }
    };
    fetchAccount();
  }, [jwtToken, navigate]);

  const saveMessagesToLocal = (userId, messages) => {
    localStorage.setItem(`chat_${userId}`, JSON.stringify(messages));
  };

  const setupWebSocket = useCallback(() => {
    if (!jwtToken || !idUser) return;
    const ws = new WebSocket(
      `wss://https://culcon-user-be-30883260979.asia-east2.run.app/ws/chat/customer?token=${jwtToken}`
    );
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket Connected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📥 Received WebSocket Message:", data);

      if (data.msg) {
        try {
          const messageContent = JSON.parse(data.msg);
          const timestamp =
            messageContent.timestamp || new Date().toISOString();

          const newMessage = {
            text: messageContent.message,
            sender: data.sender,
            timestamp: timestamp,
          };

          messagesRef.current = [...messagesRef.current, newMessage];
          setMessages([...messagesRef.current]);
          saveMessagesToLocal(idUser, messagesRef.current);
        } catch (error) {
          console.error("❌ Error parsing message:", error);
        }
      }
    };

    ws.onclose = () => {
      console.warn("WebSocket Disconnected. Reconnecting in 3s...");
      setTimeout(() => {
        if (
          !socketRef.current ||
          socketRef.current.readyState === WebSocket.CLOSED
        ) {
          setupWebSocket();
        }
      }, 3000);
    };

    return () => ws.close();
  }, [jwtToken, idUser]);

  useEffect(() => {
    if (idUser) {
      const storedMessages = localStorage.getItem(`chat_${idUser}`);
      setMessages(storedMessages ? JSON.parse(storedMessages) : []);
      messagesRef.current = storedMessages ? JSON.parse(storedMessages) : [];
    }
  }, [idUser]);

  useEffect(() => {
    setupWebSocket();
  }, [setupWebSocket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    if (input.trim()) {
      const timestamp = new Date().toISOString();
      const messageData = {
        type: "chat",
        sender: "user",
        message: input,
        timestamp,
      };

      socketRef.current.send(JSON.stringify(messageData));
      console.log("📤 Sent Message:", messageData);

      messagesRef.current = [
        ...messagesRef.current,
        { text: input, sender: "user", timestamp },
      ];
      setMessages([...messagesRef.current]);
      setInput("");
    }
  };

  return jwtToken ? (
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
              <div key={index} className={`message-container ${msg.sender}`}>
                <div className={`role-chat-box ${msg.sender}`}>
                  {msg.sender === "staff" ? "Staff" : "You"}
                </div>
                <div className={`message ${msg.sender}`}>{msg.text}</div>
                <p className="format-time">
                  {new Date(msg.timestamp).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              placeholder="Type a message..."
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
  ) : null;
};

export default ChatBot;
