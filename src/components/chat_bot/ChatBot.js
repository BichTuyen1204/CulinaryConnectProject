import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChatBot.css";
import { MdSend } from "react-icons/md";
import { BsChatTextFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AccountService from "../../api/AccountService";

const REACT_APP_BACKEND_WS_ENDPOINT = process.env.REACT_APP_BACKEND_WS_ENDPOINT;

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
      `${REACT_APP_BACKEND_WS_ENDPOINT}/ws/chat/customer?token=${jwtToken}`
    );
    socketRef.current = ws;

    ws.onopen = () => "";

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "data" && Array.isArray(data.chatlog)) {
        const parsedMessages = data.chatlog
          .map((msgObj) => {
            try {
              const messageContent = JSON.parse(msgObj.msg);
              return {
                text: messageContent.message,
                sender: messageContent.sender,
                timestamp: messageContent.timestamp,
              };
            } catch (error) {
              return null;
            }
          })
          .filter(Boolean);

        const newMessages = parsedMessages.filter(
          (msg) =>
            !messagesRef.current.some((m) => m.timestamp === msg.timestamp)
        );

        if (newMessages.length > 0) {
          messagesRef.current = [...messagesRef.current, ...newMessages];
          setMessages([...messagesRef.current]);
          saveMessagesToLocal(idUser, messagesRef.current);
        }
      } else if (data.msg) {
        try {
          const messageContent = JSON.parse(data.msg);
          if (messageContent.type === "chat") {
            const newMessage = {
              text: messageContent.message,
              sender: messageContent.sender,
              timestamp: messageContent.timestamp,
            };

            if (
              !messagesRef.current.some(
                (m) => m.timestamp === newMessage.timestamp
              )
            ) {
              messagesRef.current = [...messagesRef.current, newMessage];
              setMessages([...messagesRef.current]);
              saveMessagesToLocal(idUser, messagesRef.current);
            }
          }
        } catch (error) {
          console.error("Lỗi khi parse tin nhắn từ server:", error);
        }
      }
    };

    ws.onclose = () => {
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
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen]);

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

      const newMessage = { text: input, sender: "user", timestamp };
      messagesRef.current = [...messagesRef.current, newMessage];
      setMessages([...messagesRef.current]);
      saveMessagesToLocal(idUser, messagesRef.current);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

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
