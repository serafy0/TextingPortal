import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { UserProvider } from '../Context/useAuth';
import { LoginForm } from '../components/forms/loginForm';
import { Dashboard } from '../components/dashboard/dashboard';
import { RegisterForm } from '../components/forms/RegisterFrom';

// Root component that provides the User context to all routes
const Root = () => (
  <UserProvider>
    <Outlet />
  </UserProvider>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: 'login', element: <LoginForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'dashboard', element: <Dashboard /> },
      // ...other routes
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
