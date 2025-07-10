import DashboardPage from './DashboardPage';
import UsersPage from './UsersPage';
import ReportsPage from './ReportsPage';

import UserData from './UserData';
import ProductData from './ProductData';
import OrderData from './OrderData';

const routes = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
    roleIds: ['user', 'administrador', 'cliente', 'usuario'],
  },
  {
    path: '/users',
    element: <UsersPage />,
    roleIds: ['administrador'],
  },
  {
    path: '/reports',
    element: <ReportsPage />,
    roleIds: ['administrador', 'user', 'cliente'],
  },
  {
    path: '/usuarios',
    element: <UserData />,
    roleIds: ['administrador'],
  },
  {
    path: '/productos',
    element: <ProductData />,
    roleIds: ['administrador', 'user'],
  },
  {
    path: '/ordenes',
    element: <OrderData />,
    roleIds: ['administrador', 'user'],
  },
];

export default routes;
