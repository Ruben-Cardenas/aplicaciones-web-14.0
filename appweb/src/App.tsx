// src/App.tsx
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
import routes from './components/menuRoutes';
import Login from './components/Login';
import Layout from './components/Layout';
import { useAuth, AuthProvider } from './auth/AuthContext';
import React from 'react';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.roleIds.includes(role || '') ? (
                route.element
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
