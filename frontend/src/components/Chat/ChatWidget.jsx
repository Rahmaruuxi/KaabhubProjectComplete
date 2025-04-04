import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import PredefinedQuestions from "./PredefinedQuestions";
import { Link } from "react-router-dom";
import config from "../../config";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef();
  const { user, token } = useAuth();

  useEffect(() => {
    socket.current = io(config.API_URL);
    if (token) {
      fetchChats();
    }

    // Set up socket event listener
    socket.current.on("message-received", handleMessageReceived);

    return () => {
      if (socket.current) {
        socket.current.off("message-received", handleMessageReceived);
        socket.current.disconnect();
      }
    };
  }, [token]);

  const handleMessageReceived = (data) => {
    if (currentChat && currentChat._id === data.chatId) {
      setCurrentChat((prev) => ({
        ...prev,
        messages: [...prev.messages, data.message],
      }));
    }
  };

  useEffect(() => {
    if (currentChat) {
      socket.current.emit("join-chat", currentChat._id);
    }

    return () => {
      if (currentChat) {
        socket.current.emit("leave-chat", currentChat._id);
      }
    };
  }, [currentChat]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/chat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/chat`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChats((prev) => [response.data, ...prev]);
      setCurrentChat(response.data);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleQuestionSelect = (question) => {
    setMessage(question);
    // Automatically send the question when selected
    if (currentChat) {
      handleSendMessage(null, question);
    } else {
      createNewChat().then(() => {
        handleSendMessage(null, question);
      });
    }
  };

  const handleSendMessage = async (e, directMessage = null) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    const messageToSend = directMessage || message;
    if (!messageToSend.trim() || loading) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${config.API_URL}/api/chat/${currentChat._id}/messages`,
        { message: messageToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentChat(response.data);
      setMessage("");
      socket.current.emit("new-message", {
        chatId: currentChat._id,
        message: response.data.messages[response.data.messages.length - 1],
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const renderMessage = (content) => {
    // Check if the message contains HTML links
    if (content.includes("<a href=")) {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;

      // Replace links with React Router Links
      const links = tempDiv.getElementsByTagName("a");
      Array.from(links).forEach((link) => {
        const href = link.getAttribute("href");
        const text = link.textContent;
        const className = link.getAttribute("class");
        content = content.replace(
          link.outerHTML,
          `<Link to="${href}" className="${className}">${text}</Link>`
        );
      });
    }
    return content;
  };

  // If user is not logged in, don't render the chat widget
  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#136269] text-white p-3 rounded-full shadow-lg hover:bg-[#5DB2B3] transition-colors"
        aria-label="Open chat"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col h-[500px]">
            <div className="flex items-center justify-between p-4 bg-[#136269] text-white">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h2 className="text-lg font-semibold">AI Assistant</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {currentChat ? (
                <div className="space-y-4">
                  {currentChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-[#136269] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: renderMessage(message.content),
                        }}
                      />
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <PredefinedQuestions
                    onQuestionSelect={handleQuestionSelect}
                  />
                  <button
                    onClick={createNewChat}
                    className="bg-[#136269] hover:bg-[#5DB2B3] text-white font-semibold py-2 px-6 rounded-lg mb-4 transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              )}
            </div>

            {currentChat && (
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136269]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="bg-[#136269] text-white p-2 rounded-lg hover:bg-[#5DB2B3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
