import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { AuthProvider } from "react-oidc-context";
// import { oidcConfig } from "./config/authConfig";
import { BrowserRouter } from 'react-router-dom';
import { useMsalAuthProvider } from './hooks/useMsalAuthProvider.ts';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { MsalAuthProvider } = useMsalAuthProvider();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalAuthProvider>
  </StrictMode>,
)
