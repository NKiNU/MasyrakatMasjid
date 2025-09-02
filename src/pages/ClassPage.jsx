import React, { useState } from 'react';
import ClassList from '../components/Class/ClassList';
import IslamicVideoList from '../components/Lecture/IslamicVideoList';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import MainLayout from '../components/MainLayout';

const TabButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-6 py-3 text-sm font-medium transition-all duration-200
      ${isActive 
        ? 'text-white bg-blue-600 rounded-lg shadow-lg transform scale-105' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg'
      }
    `}
  >
    {children}
  </button>
);

const TabContent = ({ isActive, children }) => (
  <div
    className={`
      transition-all duration-300 transform
      ${isActive 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-4 absolute'
      }
    `}
  >
    {children}
  </div>
);

const EducationSection = () => {
  const [activeTab, setActiveTab] = useState('classes');

  return (
    <>
      <SidebarNavigation />
      <MainLayout>
        <div className="min-h-screen bg-gray-200">
          <div className="max-w-8xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Tab Navigation */}
              <div className="flex space-x-4 mb-8 p-2 bg-gray-50 rounded-lg">
                <TabButton 
                  isActive={activeTab === 'classes'}
                  onClick={() => setActiveTab('classes')}
                >
                  Classes
                </TabButton>
                <TabButton 
                  isActive={activeTab === 'kuliyyah'}
                  onClick={() => setActiveTab('kuliyyah')}
                >
                  Kuliyyah
                </TabButton>
              </div>

              {/* Tab Content */}
              <div className="relative">
                <TabContent isActive={activeTab === 'classes'}>
                  <ClassList />
                </TabContent>
                <TabContent isActive={activeTab === 'kuliyyah'}>
                  <IslamicVideoList />
                </TabContent>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default EducationSection;