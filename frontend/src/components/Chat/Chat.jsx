import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef();
  const { user } = useAuth();

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_BACKEND_URL);
    fetchChats();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentChat) {
      socket.current.emit('join-chat', currentChat._id);
    }

    return () => {
      if (currentChat) {
        socket.current.emit('leave-chat', currentChat._id);
      }
    };
  }, [currentChat]);

  useEffect(() => {
    socket.current.on('message-received', (data) => {
      if (currentChat && currentChat._id === data.chatId) {
        setCurrentChat(prev => ({
          ...prev,
          messages: [...prev.messages, data.message]
        }));
      }
    });
  }, [currentChat]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat`);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`);
      setChats(prev => [response.data, ...prev]);
      setCurrentChat(response.data);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChat) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/${currentChat._id}/messages`,
        { message }
      );

      setCurrentChat(response.data);
      setMessage('');
      socket.current.emit('new-message', {
        chatId: currentChat._id,
        message: response.data.messages[response.data.messages.length - 1]
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#136269] text-white p-4">
        <button
          onClick={createNewChat}
          className="w-full bg-[#5DB2B3] hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-lg mb-4"
        >
          New Chat
        </button>
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setCurrentChat(chat)}
              className={`p-3 rounded-lg cursor-pointer ${
                currentChat?._id === chat._id ? 'bg-[#5DB2B3]' : 'hover:bg-opacity-80'
              }`}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-[#136269] text-white'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DB2B3]"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#136269] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat or create a new one
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat; 