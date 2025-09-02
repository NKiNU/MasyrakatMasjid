import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen pt-16 md:pt-0 md:pl-64 bg-gray-200">
      <div>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;