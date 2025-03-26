import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChatChef.css";
import { MdSend } from "react-icons/md";
import { PiChefHatBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import AccountService from "../../api/AccountService";
import ReactMarkdown from "react-markdown";

const REACT_APP_BACKEND_WS_ENDPOINT = process.env.REACT_APP_BACKEND_WS_ENDPOINT;

const ChatChef = () => {
  const [messagesChef, setMessagesChef] = useState([]);
  const messagesRef = useRef([]);
  const [inputChef, setInputChef] = useState("");
  const [isOpenChef, setIsOpenChef] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const messagesEndRefChef = useRef(null);
  const socketRef = useRef(null);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const messageBuffer = useRef("");

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
    localStorage.setItem(`chat_chef_${userId}`, JSON.stringify(messages));
  };

  const setupWebSocket = useCallback(() => {
    if (!jwtToken || !idUser) return;
    const ws = new WebSocket(
      `${REACT_APP_BACKEND_WS_ENDPOINT}/ws/chef?token=${jwtToken}`
    );
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected!");
    };

    ws.onmessage = (event) => {
      try {
        const rawMessage = event.data;
        console.log("Raw message received:", rawMessage);

        messageBuffer.current += rawMessage;

        if (
          messageBuffer.current.includes("<chat>") &&
          messageBuffer.current.includes("</chat>")
        ) {
          const fullMessage =
            messageBuffer.current.match(/<chat>(.*?)<\/chat>/s);
          if (fullMessage && fullMessage[1]) {
            let messageContent = fullMessage[1].trim();

            // **Xử lý Markdown và tách từ**
            messageContent = messageContent
              .replace(/([a-z])([A-Z])/g, "$1 $2") // Thêm dấu cách giữa chữ thường và chữ hoa
              .replace(/([a-zA-Z])(\d)/g, "$1 $2") // Thêm dấu cách giữa chữ và số
              .replace(/(\d)([a-zA-Z])/g, "$1 $2") // Thêm dấu cách giữa số và chữ
              .replace(/([.,!?])([A-Za-z])/g, "$1 $2") // Thêm dấu cách sau dấu câu
              .replace(/([a-zA-Z])([.,!?])/g, "$1$2")
              .replace(/---/g, "\n\n") // Không thêm dấu cách trước dấu câu
              .replace(/\s+/g, " "); // Xóa khoảng trắng thừa

            console.log("Formatted message:", messageContent);

            let words = messageContent.split(/\s+/);

            let newMessage = {
              text: "",
              sender: "Bot",
              timestamp: new Date().toISOString(),
            };

            let index = 0;
            const interval = setInterval(() => {
              if (index < words.length) {
                newMessage.text += words[index] + " ";

                setMessagesChef((prevMessages) => {
                  let updatedMessages = [...prevMessages];

                  if (
                    updatedMessages.length > 0 &&
                    updatedMessages[updatedMessages.length - 1].sender === "Bot"
                  ) {
                    updatedMessages[updatedMessages.length - 1] = {
                      ...newMessage,
                    };
                  } else {
                    updatedMessages.push({ ...newMessage });
                  }

                  // ✅ Lưu tin nhắn vào localStorage
                  messagesRef.current = updatedMessages;
                  saveMessagesToLocal(idUser, messagesRef.current);

                  return updatedMessages;
                });

                index++;
              } else {
                clearInterval(interval);
              }
            }, 150);

            messageBuffer.current = "";
          }
        }
      } catch (error) {
        console.warn("Error processing message:", error);
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
      const storedMessages = localStorage.getItem(`chat_chef_${idUser}`);
      setMessagesChef(storedMessages ? JSON.parse(storedMessages) : []);
      messagesRef.current = storedMessages ? JSON.parse(storedMessages) : [];
    }
  }, [idUser]);

  useEffect(() => {
    if (isOpenChef) {
      setTimeout(() => {
        messagesEndRefChef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpenChef]);

  useEffect(() => {
    setupWebSocket();
  }, [setupWebSocket]);

  useEffect(() => {
    messagesEndRefChef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesChef]);

  const sendMessageChef = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    if (inputChef.trim()) {
      const timestamp = new Date().toISOString();
      const messageData = {
        type: "chat",
        sender: "user",
        message: inputChef,
        timestamp,
      };

      socketRef.current.send(JSON.stringify(messageData));

      const newMessage = { text: inputChef, sender: "user", timestamp };
      messagesRef.current = [...messagesRef.current, newMessage];
      setMessagesChef([...messagesRef.current]);
      saveMessagesToLocal(idUser, messagesRef.current);
      messagesEndRefChef.current?.scrollIntoView({ behavior: "smooth" });

      setInputChef("");
    }
  };

  return jwtToken ? (
    <div className="chat-container-chef">
      {!isOpenChef && (
        <button
          className="chat-toggle-chef"
          onClick={() => setIsOpenChef(true)}
        >
          <PiChefHatBold className="ic-chat-chef" />
        </button>
      )}
      {isOpenChef && (
        <div className="chat-chef-box">
          <div className="chat-header-chef">
            <span>Chat with Chef</span>
            <button
              className="close-chat-chef"
              onClick={() => setIsOpenChef(false)}
            >
              ✖
            </button>
          </div>

          <div className="chat-messages-chef">
            {messagesChef.map((msg, index) => (
              <div
                key={index}
                className={`message-container-chef ${msg.sender}`}
              >
                <div className={`role-chat-box-chef ${msg.sender}`}>
                  {msg.sender === "Bot" ? "Chef" : "You"}
                </div>
                <div className={`message-chef ${msg.sender}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <p className="format-time-chef">
                  {new Date(msg.timestamp).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
            <div ref={messagesEndRefChef} />
          </div>

          <div className="chat-input-chef">
            <input
              placeholder="Type a message..."
              value={inputChef}
              onChange={(e) => setInputChef(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessageChef()}
              className="chat-textarea-chef"
            />
            <MdSend className="ic-send-chef" onClick={sendMessageChef} />
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default ChatChef;
