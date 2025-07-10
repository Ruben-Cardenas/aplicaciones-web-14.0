// src/components/Layout.tsx

import { Outlet } from 'react-router-dom';
import MenuDynamic from './menuDynamic';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <div className="sidebar">
        <MenuDynamic />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
