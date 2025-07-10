import type { JSX } from "react";

export interface MenuRoutes {
    path:string;
    element:JSX.Element;
    label: string

}


const routes:MenuRoutes[] = [
    {
        path : '/dashboard',
        element:<p>Dashboard</p>,
        label: 'Usuarios'
    },
    {
        path : '/users',
        element: <p>Usuarios</p>,
        label: 'Usuarios'
    },
    {
        path : '/reports',
        element: <p>Productos</p>,
        label: 'Productos'
    },
    {
        path : '/orders',
        element: <p>Ordenes</p>,
        label: 'Ordenes'
    },
];

export default routes 