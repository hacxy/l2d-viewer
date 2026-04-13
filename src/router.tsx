import { createBrowserRouter, Navigate } from 'react-router'
import ViewerPage from '@/pages/ViewerPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/viewer" replace />,
  },
  {
    path: '/viewer',
    element: <ViewerPage />,
  },
  {
    path: '*',
    element: <Navigate to="/viewer" replace />,
  },
])
