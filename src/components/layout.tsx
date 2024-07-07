import React from 'react';
import Navbar from './navbar';
import Sidebar from './dash-side';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
