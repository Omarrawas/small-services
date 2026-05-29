import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import { AuthProvider } from "@/providers/AuthProvider"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <TRPCProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TRPCProvider>
  </HashRouter>,
)
