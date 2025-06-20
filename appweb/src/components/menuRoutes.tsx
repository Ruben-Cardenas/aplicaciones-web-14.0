import type { JSX } from "react";
import UserForm from "../components/userform";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  label?: string;
  icon?: string;
  roleIds?: string[]; 
  hidden?: boolean;
}

const routes: AppRoute[] = [
  {
    path: '/',
    element: <UserForm />,
    label: 'Inicio',
    icon: 'HomeOutlined',
  },
  {
    path: '/users',
    element: <UserForm />,
    label: 'Usuarios',
    icon: 'UserOutlined',
  },
  {
    path: '/dashboard',
    element: <UserForm />,
    label: 'Usuarios',
    icon: 'UserOutlined',
  },
  {
    path: '/users',
    element: <UserForm />,
    label: 'Usuarios',
    icon: 'UserOutlined',
  }
];

export default routes;
