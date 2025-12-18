import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

export const CallbackPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="text-xl font-semibold">กำลังยืนยันตัวตนกับ KMUTT... (Processing Login)</div>
    </div>
  );
};