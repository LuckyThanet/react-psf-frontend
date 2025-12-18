// src/App.tsx หรือ Router configuration
import { Routes, Route } from "react-router-dom";
import { CallbackPage } from "./pages/CallbackPage";
import HomePage from "./pages/HomePage";
import { MsalAuthenticationTemplate } from "@azure/msal-react";

import { InteractionType } from "@azure/msal-browser";

function App() {
  console.log("test" , import.meta.env.VITE_ADFS_CLIENTID);
  return (
    <Routes>

      {/* แนะนำสร้าง Applayout ขึ้นมานะครับ
       <Route element={
        <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
          <AppLayout/>
      </MsalAuthenticationTemplate>
      }>

      </Route>
       */}
      <Route
        path="/"
        element={
          <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
            <HomePage />
          </MsalAuthenticationTemplate>
        }
      />

      <Route path="/auth/callback" element={<CallbackPage />} />
    </Routes>
  );
}

export default App;