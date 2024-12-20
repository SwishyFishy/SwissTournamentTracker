import { createContext } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import routes from './routes/routes'
import {server_ipv4, server_port} from './private.tsx';

import './styles/index.css'

const router = createBrowserRouter(routes);
export const CONTEXT_serverBaseUrl: React.Context<string> = createContext(`http://${server_ipv4}:${server_port}/`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
