import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";
import useWebSocket from "react-use-websocket";

// const ChatBot = () => {
// const [messages, setMessages] = useState([]);
// const [input, setInput] = useState("");
// const [isOpen, setIsOpen] = useState(false);
// const [isTyping, setIsTyping] = useState(false);
// const chatEndRef = useRef(null);
// const textareaRef = useRef(null);

// // Handles sending user messages
// const handleSend = () => {
//   if (input.trim() && !isTyping) {
//     setIsTyping(true);

//     const newMessages = [...messages, { text: input, sender: "user" }];
//     setMessages(newMessages);
//     setInput("");

//     // Placeholder for WebSocket bot message sending
//       // ------------------------------------
//     setTimeout(() => {
//       setMessages([...newMessages, { text: "Hi!", sender: "bot" }]);
//       setIsTyping(false);
//       textareaRef.current?.focus();
//     }, 1000);
//      // ------------------------------------
//   }
// };

// // Auto-scroll when messages update
// useEffect(() => {
//   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
// }, [messages]);

// // Handle Enter and Shift + Enter
// const handleKeyDown = (e) => {
//   if (e.key === "Enter") {
//     if (e.shiftKey) {
//       e.preventDefault();
//       setInput((prev) => prev + "\n");
//     } else {
//       e.preventDefault();
//       handleSend();
//     }
//   }
// };

// return (
//   <div className="chat-container">
//     {!isOpen && (
//       <button className="chat-toggle" onClick={() => setIsOpen(true)}>
//         💬
//       </button>
//     )}
//     {isOpen && (
//       <div className="chat-bot">
//         <div className="chat-header">
//           <span>Chat with Us</span>
//           <button className="close-chat" onClick={() => setIsOpen(false)}>
//             ✖
//           </button>
//         </div>
//         <div className="chat-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender}`}>
//               {msg.text}
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>
//         <div className="chat-input">
//           <textarea
//             ref={textareaRef}
//             placeholder={isTyping ? "Bot is typing..." : "Type a message..."}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             disabled={isTyping}
//             className="chat-textarea"
//           />
//           <button
//             onClick={handleSend}
//             disabled={isTyping}
//             className={isTyping ? "disabled-btn" : ""}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     )}
//   </div>
// );

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const socketUrl = "wss://localhost:8000/ws/chat/customer";

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("✅ WebSocket Connected"),
      onError: (event) => {
        console.error("❌ WebSocket Error:", event);
        setError("WebSocket connection error. Check console for details.");
      },
      onClose: (event) => {
        console.warn(`🔴 WebSocket Disconnected (Code: ${event.code})`, event);
        setError(
          `WebSocket closed: Code ${event.code}, Reason: ${event.reason}`
        );
      },
    }
  );

  // Nhận tin nhắn từ WebSocket
  React.useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessages((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      console.log("📤 Sending message:", message);
      sendJsonMessage({ type: "chat", message });
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat Box</h2>
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default ChatBot;
