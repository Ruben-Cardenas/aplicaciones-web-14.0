// src/components/MenuDynamic.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useAuth } from '../auth/AuthContext';

const iconMap = {
  DashboardOutlined: <DashboardOutlined />,
  UserOutlined: <UserOutlined />,
  BarChartOutlined: <BarChartOutlined />,
};

interface MenuItem {
  title: string;
  path: string;
  icon: keyof typeof iconMap;
  roles: string[]; // roles válidos: 'administrador', 'user', 'cliente', 'usuario'
}

const MenuDynamic: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const fakeMenuData: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'DashboardOutlined',
      roles: ['user', 'administrador', 'cliente', 'usuario'],
    },
    {
      title: 'Usuarios',
      path: '/users',
      icon: 'UserOutlined',
      roles: ['administrador'],
    },
    {
      title: 'Reportes',
      path: '/reports',
      icon: 'BarChartOutlined',
      roles: ['administrador', 'user', 'cliente'],
    },
    {
      title: 'Lista de Usuarios',
      path: '/usuarios',
      icon: 'UserOutlined',
      roles: ['administrador'],
    },
    {
      title: 'Productos',
      path: '/productos',
      icon: 'BarChartOutlined',
      roles: ['administrador', 'user'],
    },
    {
      title: 'Órdenes',
      path: '/ordenes',
      icon: 'BarChartOutlined',
      roles: ['administrador', 'user'],
    },
  ];

  setMenuItems(fakeMenuData);
}, []);


  const renderMenu = () => {
    if (!role) return [];
    return menuItems
      .filter((item) => item.roles.includes(role))
      .map((item) => ({
        key: item.path,
        icon: iconMap[item.icon],
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
