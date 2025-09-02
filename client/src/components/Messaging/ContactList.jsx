import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const ContactList = ({ userId, setSelectedContact, selectedContact }) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const { data } = await axios.get('http://localhost:3001/api/chat/contacts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(data);
      setContacts(data);
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-8 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884]"
          />
          <Search className="absolute left-2 top-2.5 text-gray-500 w-4 h-4" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact._id}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
              selectedContact?._id === contact._id ? 'bg-gray-100' : ''
            }`}
            onClick={() => setSelectedContact(contact)}
          >
            <img 
              src={contact.profileImage || '/api/placeholder/48/48'} 
              alt="Profile" 
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium truncate">{contact.username}</h3>
                <span className="text-xs text-gray-500 ml-2">12:30</span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {contact.lastMessage || 'Start a conversation'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;