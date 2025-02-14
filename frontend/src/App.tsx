// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { UserProvider } from './Context/useAuth';
import { Outlet, RouterProvider } from 'react-router-dom';
import { AppRouter } from './routes/Routes';
import { Notifications } from '@mantine/notifications';

export default function App() {
  return <MantineProvider>
          <Notifications />

          {<AppRouter />}
        </MantineProvider>;
}