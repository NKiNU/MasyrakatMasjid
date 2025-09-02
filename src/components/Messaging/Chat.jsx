// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ContactList from './ContactList';
// import ChatHistory from './ChatHistory';
// import useSocket from '../../hooks/socket';
// import { MessageCircle, Send, Search, Menu, Phone, Video, MoreVertical } from 'lucide-react';

// const ChatApp = ({ userId }) => {
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messageList, setMessageList] = useState([]); // Store chat messages
//   const socket = useSocket(localStorage.getItem('token') || '');

//   useEffect(() => {
//     if (selectedContact) {
//       // Fetch chat history when a contact is selected
//       const fetchChatHistory = async () => {
//         const {data} = await axios.get(`http://localhost:3001/api/chat/chats/${selectedContact._id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
        
//         setMessageList(data); // Load chat history
//       };
//       fetchChatHistory();
//     }
//   }, [selectedContact, userId]);


// useEffect(() => {
//   if (socket) {
//     socket.on('receiveMessage', (newMessage) => {
      
      

//       console.log('Message for this user');
      
//       console.log("new",newMessage);
//       setMessageList((prevMessages) => [...prevMessages, newMessage]);
//     });
//     socket.on('message', (newMessage) => {
//       setMessageList(prevMessages => 
//         Array.isArray(prevMessages) ? [...prevMessages, newMessage] : [newMessage]
//       );
//     });
//     console.log(messageList);

//     return () => {
//       socket.off('message');
//       socket.off('receiveMessage');
//     };
//   }
// }, [socket]);


// const sendMessage = () => {
//   if (!message.trim()) return; // Avoid sending empty messages

//   const messageObject = {
//     receiver: selectedContact._id,
//     message: message,
//   };


//   console.log(messageObject);
//   axios.post('http://localhost:3001/api/chat/messages', messageObject, {
//     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//   })

//   // Emit the message to the server
//   socket.emit('sendMessage', messageObject);
//     // Update the messages state immediately
//     // Update the message list immediately (incomplete message)
//   setMessageList((prevMessages) =>
//     Array.isArray(prevMessages) ? [...prevMessages, messageObject] : [messageObject]
//   );

  



//   // Clear the input field
//   setMessage('');
// };


//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Contacts Panel */}
//       <div className="w-1/3 bg-white border-r border-gray-200">
//         <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
//           <img 
//             src="/api/placeholder/40/40" 
//             alt="Your Profile" 
//             className="w-10 h-10 rounded-full"
//           />
//           <div className="flex gap-4">
//             <MessageCircle className="text-gray-600 w-5 h-5" />
//             <Menu className="text-gray-600 w-5 h-5" />
//             <MoreVertical className="text-gray-600 w-5 h-5" />
//           </div>
//         </div>
        
//         <div className="h-[calc(100vh-4rem)] overflow-hidden">
//           <ContactList 
//             userId={userId} 
//             setSelectedContact={setSelectedContact} 
//             selectedContact={selectedContact}
//           />
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 flex flex-col">
//         {selectedContact ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
//               <div className="flex items-center">
//                 <img 
//                   src={selectedContact.profileImage || '/api/placeholder/40/40'} 
//                   alt="Contact Profile" 
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//                 <div>
//                   <h2 className="font-medium">{selectedContact.username}</h2>
//                   <p className="text-sm text-gray-500">online</p>
//                 </div>
//               </div>
//               <div className="flex gap-4">
//                 <Video className="text-gray-600 w-5 h-5" />
//                 <Phone className="text-gray-600 w-5 h-5" />
//                 <Search className="text-gray-600 w-5 h-5" />
//                 <MoreVertical className="text-gray-600 w-5 h-5" />
//               </div>
//             </div>

//             {/* Chat Messages */}
//             <div className="flex-1 overflow-y-auto bg-[#efeae2]">
//             <div>
//                 <ChatHistory userId={userId} contact={selectedContact} messages={messageList} />
//             </div>
//             <div>
//               {messageList}
//             </div>
//             </div>

//             {/* Message Input */}
//             <div className="p-4 bg-gray-50 border-t">
//               <div className="flex items-center gap-2">
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type a message"
//                   className="flex-1 p-3 rounded-lg resize-none max-h-32 focus:outline-none focus:ring-1 focus:ring-[#00a884]"
//                   rows="1"
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f72] transition-colors"
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center bg-gray-50">
//             <div className="text-center text-gray-500">
//               <MessageCircle className="w-16 h-16 mx-auto mb-4" />
//               <h2 className="text-xl font-medium">Select a chat to start messaging</h2>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatApp;
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import useSocket from '../../hooks/socket';
// import { useAuth } from '../../context/AuthContext';
// import { MessageCircle, Send, Search, Menu, Phone, Video, MoreVertical, CheckCheck } from 'lucide-react';

// const ChatApp = ({ userId,inboxUserId }) => {
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messageList, setMessageList] = useState([]);
//   const [contacts, setContacts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const socket = useSocket(localStorage.getItem('token') || '');
//   const messagesEndRef = useRef(null);
//   const { currentUser } = useAuth();
//   const [selectedRole, setSelectedRole] = useState('all');  

//   useEffect(() => { 
//     console.log("current user in chat page", currentUser) 
//   }, [currentUser]);

//   // Fetch contacts
//   // useEffect(() => {
//   //   console.log('Fetching contacts');
//   //   console.log(messageList)
//   //   console.log(localStorage.getItem('token'))
//   //   const fetchContacts = async () => {
//   //     const { data } = await axios.get('http://localhost:3001/api/chat/contacts', {
//   //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//   //     });
//   //     setContacts(data);
//   //   };
//   //   fetchContacts();
//   // }, []);

//     // Fetch contacts and set initial selected contact if coming from inbox
//     useEffect(() => {
//       const fetchContacts = async () => {
//         try {
//           const { data } = await axios.get('http://localhost:3001/api/chat/contacts', {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           });
//           setContacts(data);
//           console.log(contacts);
          
//           // If inboxUserId is provided, find and select that contact
//           if (inboxUserId) {
//             const inboxContact = data.find(contact => contact._id === inboxUserId);
//             if (inboxContact) {
//               setSelectedContact(inboxContact);
//               console.log("did it passed?",inboxContact)
//             }
//           }
//         } catch (error) {
//           console.error('Error fetching contacts:', error);
//         }
//       };
//       fetchContacts();
//     }, [inboxUserId]);  // Add inboxUserId as dependency

//   // Fetch chat history
//   useEffect(() => {
//     if (selectedContact) {
//       const fetchChatHistory = async () => {
//         const { data } = await axios.get(`http://localhost:3001/api/chat/chats/${selectedContact._id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setMessageList(data);
//       };
//       fetchChatHistory();
//     }
//   }, [selectedContact]);

//   // Handle socket events
//   useEffect(() => {
//     if (socket) {
//       console.log('Socket connected');

//       // looking for messages
//       socket.on('receiveMessage', (newMessage) => {
//         console.log('New message received:', newMessage);
//         console.log("selected contact",selectedContact)
        
//         const { sender,receiver, message } = newMessage;
        
        
//         console.log("sender",sender);
//         console.log("receiver",receiver);
        
//         if (selectedContact && sender === selectedContact._id) {
//           console.log("new message")
//           setMessageList((prevMessages) => [...prevMessages, { sender, message }]);
//         }
//         console.log("cannot new message")
//     });

//       return () => {
//         socket.off('receiveMessage');
//       };
//     }
//   }, [socket, currentUser, selectedContact]);

//   // Scroll to bottom of messages
  
//   // useEffect(() => {
//   //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   // }, [messageList]);

  

//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const messageObject = {
//       sender: currentUser._id,
//       receiver: selectedContact._id,
//       message: message,
//     };

//     axios.post('http://localhost:3001/api/chat/messages', messageObject, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//     });

//     socket.emit('sendMessage', messageObject);
//     setMessageList((prevMessages) => [...prevMessages, messageObject]);
//     setMessage('');
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const filteredContacts = contacts.filter((contact) => {
//     const matchesSearch = contact.username?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRole = selectedRole === 'all' || contact.role === selectedRole;
//     return matchesSearch && matchesRole;
//   });

//   return (
//     <div className="flex  bg-white">
//       {/* Contacts Panel */}
//       <div className="w-80 border-r">
//         <div className="p-4 border-b">
//           <div className="flex items-center gap-2 mb-4">
//             <input
//               type="text"
//               placeholder="Search contacts"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="flex-1 p-2 border rounded"
//             />
//             <select
//               value={selectedRole}
//               onChange={(e) => setSelectedRole(e.target.value)}
//               className="p-2 border rounded bg-white"
//             >
//               <option value="all">All Roles</option>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//               <option value="super admin">Super Admin</option>
//             </select>
//           </div>
//         </div>

//         <div className="overflow-y-auto h-[calc(100vh-9rem)]">
//           {filteredContacts.map((contact) => (
//             <div
//               key={contact._id}
//               onClick={() => setSelectedContact(contact)}
//               className={`p-4 cursor-pointer hover:bg-gray-50 ${
//                 selectedContact?._id === contact._id ? 'bg-gray-100' : ''
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                   {contact.username?.[0]?.toUpperCase()}
//                 </div>
//                 <div>
//                   <h3 className="font-medium">{contact.username}</h3>
//                   <span className="text-sm text-gray-500 capitalize">{contact.role}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 flex flex-col">
//         {selectedContact ? (
//           <>
//             <div className="p-4 border-b bg-white">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                   {selectedContact.username[0].toUpperCase()}
//                 </div>
//                 <h2 className="font-medium">{selectedContact.username}</h2>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//               {messageList.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'} mb-4`}
//                 >
//                   <div
//                     className={`max-w-[70%] rounded-lg p-3 ${
//                       msg.sender === currentUser._id ? 'bg-blue-500 text-white' : 'bg-white'
//                     }`}
//                   >
//                     <p>{msg.message}</p>
//                     <p>{msg.createdAt}</p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="p-4 border-t bg-white">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type a message"
//                   className="flex-1 p-2 border rounded"
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center bg-gray-50">
//             <div className="text-center text-gray-500">
//               <MessageCircle className="w-12 h-12 mx-auto mb-2" />
//               <p>Select a chat to start messaging</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatApp;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useSocket from '../../hooks/socket';
import { useAuth } from '../../context/AuthContext';
import { MessageCircle, Send, Search, Menu, Phone, Video, MoreVertical, CheckCheck } from 'lucide-react';

const ChatApp = ({ userId, inboxUserId }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const socket = useSocket(localStorage.getItem('token') || '');
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState('all');

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
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

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/chat/contacts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setContacts(data);
        
        if (inboxUserId) {
          const inboxContact = data.find(contact => contact._id === inboxUserId);
          if (inboxContact) {
            setSelectedContact(inboxContact);
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, [inboxUserId]);

  useEffect(() => {
    if (selectedContact) {
      const fetchChatHistory = async () => {
        const { data } = await axios.get(`http://localhost:3001/api/chat/chats/${selectedContact._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessageList(data);
      };
      fetchChatHistory();
    }
  }, [selectedContact]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (newMessage) => {
        const { sender, receiver, message } = newMessage;
        if (selectedContact && sender === selectedContact._id) {
          setMessageList((prevMessages) => [...prevMessages, { sender, message, createdAt: new Date() }]);
        }
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageObject = {
      sender: currentUser._id,
      receiver: selectedContact._id,
      message: message,
      createdAt: new Date()
    };

    axios.post('http://localhost:3001/api/chat/messages', messageObject, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    socket.emit('sendMessage', messageObject);
    setMessageList((prevMessages) => [...prevMessages, messageObject]);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || contact.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex bg-white">
      {/* Contacts Panel */}
      <div className="w-80 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Search contacts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super admin">Super Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-9rem)]">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedContact?._id === contact._id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {contact.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">{contact.username}</h3>
                  <span className="text-sm text-gray-500 capitalize">{contact.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedContact.username[0].toUpperCase()}
                </div>
                <h2 className="font-medium">{selectedContact.username}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messageList.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === currentUser._id ? 'bg-blue-500 text-white' : 'bg-white'
                    }`}
                  >
                    <p className="mb-1">{msg.message}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className={`text-xs ${
                        msg.sender === currentUser._id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatMessageTime(msg.createdAt)}
                      </span>
                      {msg.sender === currentUser._id && (
                        <CheckCheck className="w-4 h-4 text-blue-100" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;