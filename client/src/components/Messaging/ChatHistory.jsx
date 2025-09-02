import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { CheckCheck } from 'lucide-react';

const ChatHistory = ({ userId, contact }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (contact) {
        const { data } = await axios.get(`http://localhost:3001/api/chat/chats/${contact._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(data);
      }
    };
    fetchChatHistory();
  }, [contact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format time
    const timeString = messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();

    // Check if message is from today
    if (messageDate.toDateString() === now.toDateString()) {
      return timeString;
    }
    
    // Check if message is from yesterday
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${timeString}`;
    }
    
    // If message is older than yesterday, show date
    return `${messageDate.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    })} ${timeString}`;
  };

  return (
    <div className="chat-history p-4 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[65%] rounded-lg p-3 ${
              msg.sender === userId 
                ? 'bg-[#d9fdd3] shadow-sm' 
                : 'bg-white shadow-sm'
            }`}
          >
            <p className="text-gray-800 break-words">{msg.message}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-xs text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </span>
              {msg.sender === userId && (
                <CheckCheck className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;