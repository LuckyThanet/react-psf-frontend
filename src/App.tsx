// src/App.tsx หรือ Router configuration
import { Routes, Route, Outlet } from "react-router-dom";
import { CallbackPage } from "./pages/CallbackPage";
import HomePage from "./pages/HomePage";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import AppNavbar from "./components/common/AppNavbar";
import { InteractionType } from "@azure/msal-browser";


function Layout() {
  return (
    <div>
      <AppNavbar />
      <Outlet />
    </div>
  );
}


function App() {
  // console.log("test" , import.meta.env.VITE_ADFS_CLIENTID);
  return (
    <Routes>
      <Route element={<Layout />}>
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
      </Route>

      {/* <Route path="/auth/callback" element={<CallbackPage />} /> */}
      <Route path="/redirect" element={<CallbackPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;