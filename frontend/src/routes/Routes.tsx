import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { UserProvider } from '../Context/useAuth';
import { Dashboard } from '../components/dashboard/dashboard';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import { LoginForm } from '../components/authForms/loginForm';
import { RegisterForm } from '../components/authForms/RegisterFrom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { CreateMessageTemplatePage } from '../components/messageTemplates/CreateMessageTemplatePage';
import { EditMessageTemplatePage } from '../components/messageTemplates/EditMessageTemplatePage';
import { MessageTemplatesList } from '../components/messageTemplates/MessageTemplatesList';
import { SendMessagePage } from '../components/messages/SendMessagePage';
import { MessageLogsList } from '../components/messageLogs/MessageLogsList';
import { MessageLogDetailView } from '../components/messageLogs/MessageLogDetail';
import { PhoneListsList } from '../components/phoneLists/PhoneListsList';
import { PhoneListManage } from '../components/phoneLists/PhoneListManage';

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
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <Dashboard /> },
        ],
      },
      {
        path: 'template',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'create', element: <CreateMessageTemplatePage />},
          { path: 'edit/:id', element: <EditMessageTemplatePage /> },
        ],
      },
      {
        path: 'templates',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <MessageTemplatesList /> },
        ],
      },
      {
        path: 'messages/send',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <SendMessagePage /> },
        ],
      },
      {
        path: 'logs',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <MessageLogsList /> },
          { path: ':id', element: <MessageLogDetailView /> },
        ],
      },
      {
        path: 'phonelists',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <PhoneListsList /> },
          { path: ':id/manage', element: <PhoneListManage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
