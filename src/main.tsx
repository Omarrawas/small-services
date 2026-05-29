import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import { AuthProvider } from "@/providers/AuthProvider"
import { Toaster } from "sonner"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <TRPCProvider>
      <AuthProvider>
        <App />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </TRPCProvider>
  </HashRouter>,
)
