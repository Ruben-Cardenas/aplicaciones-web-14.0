import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

// Mapeo de íconos
const iconMap = {
  DashboardOutlined: <DashboardOutlined />,
  UserOutlined: <UserOutlined />,
  BarChartOutlined: <BarChartOutlined />,
};

// Interfaz para los ítems del menú
interface MenuItem {
  title: string;
  path: string;
  icon: keyof typeof iconMap;
  roles: string[];
}

const MenuDynamic: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fakeMenuData: MenuItem[] = [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: 'DashboardOutlined',
        roles: ['665a1f2b40fd3a12b3e77611'],
      },
      {
        title: 'Usuarios',
        path: '/users',
        icon: 'UserOutlined',
        roles: ['665a1f2b40fd3a12b3e77612'],
      },
      {
        title: 'Reportes',
        path: '/reports',
        icon: 'BarChartOutlined',
        roles: ['665a1f2b40fd3a12b3e77611', '665a1f2b40fd3a12b3e77612'],
      },
    ];

    setTimeout(() => {
      setMenuItems(fakeMenuData);
    }, 500);
  }, []);

  const renderMenu = () => {
    return menuItems.map((item) => ({
      key: item.path,
      icon: iconMap[item.icon] || null,
      label: item.title,
    }));
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={(e) => navigate(e.key)}
      items={renderMenu()}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
};

export default MenuDynamic;
