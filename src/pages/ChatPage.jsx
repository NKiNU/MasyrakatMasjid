import React from 'react';
import ChatApp from '../components/Messaging/Chat';
import SidebarNavigation from '../components/SideBar/SideNavBar';
const ChatPage = () => {
  return (
    <div className='flex h-screen'>
      <div className='w-64 bg-gray-100 dark:bg-gray-800'>
        {<SidebarNavigation/>}
      </div>

    <div className='flex-1 p-6'>
        {<ChatApp/>}
      
    </div>
    </div>
  );
};

export default ChatPage;
