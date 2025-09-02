import React, { useState } from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import NotificationPage from '../components/Notification';
import ChatApp from '../components/Messaging/Chat';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import MainLayout from '../components/MainLayout';

const TabButton = ({ isActive, onClick, children, icon: Icon, count }) => (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2
        ${isActive
          ? 'text-white bg-blue-600 rounded-lg shadow-lg transform scale-105'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      {children}
      {count > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
          {count}
        </span>
      )}
    </button>
  );
  
  const TabContent = ({ isActive, children }) => (
    <div
      className={`
        transition-opacity duration-300
        ${isActive ? 'opacity-100 block' : 'opacity-0 hidden'}
        h-full
      `}
    >
      {children}
    </div>
  );
  
  const CommunicationSection = ({ userId, inboxUserId }) => {
    const [activeTab, setActiveTab] = useState('chat');
    const [unreadNotifications, setUnreadNotifications] = useState(0);
  
    const handleUnreadCountChange = (count) => {
      setUnreadNotifications(count);
    };
  
    return (
      <>
        <SidebarNavigation />
        <MainLayout>
          <div className="h-screen flex flex-col bg-gray-100 ">
            <div className="flex-1 mx-auto w-full max-w-8xl p-4 flex flex-col">
              <div className="bg-white rounded-2xl shadow-xl flex flex-col flex-1 overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex space-x-4 p-4 bg-gray-50 border-b">
                  <TabButton
                    isActive={activeTab === 'chat'}
                    onClick={() => setActiveTab('chat')}
                    icon={MessageCircle}
                  >
                    Messages
                  </TabButton>
                  <TabButton
                    isActive={activeTab === 'notifications'}
                    onClick={() => setActiveTab('notifications')}
                    icon={Bell}
                    count={unreadNotifications}
                  >
                    Notifications
                  </TabButton>
                </div>
  
                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <TabContent isActive={activeTab === 'chat'}>
                    <div className="h-full">
                      <ChatApp userId={userId} inboxUserId={inboxUserId} />
                    </div>
                  </TabContent>
                  <TabContent isActive={activeTab === 'notifications'}>
                    <div className="h-full overflow-y-auto">
                      <NotificationPage onUnreadCountChange={handleUnreadCountChange} />
                    </div>
                  </TabContent>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </>
    );
  };
  
  export default CommunicationSection;
  