import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus, EventType } from "@azure/msal-browser";
import type { AccountInfo, AuthenticationResult } from "@azure/msal-browser";
import axios from "axios";
import { useEffect, useRef } from "react";
import { ENDPOINTS } from "../constants/endpoint";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const hasFetchedRef = useRef(false);
  const { t } = useTranslation();

  type LoginResponse = {
    isSuccess: boolean;
    result: {
      token: string;
      user: { email: string; firstName: string; lastName: string };
    };
  };

  // ตั้ง active account หลัง LOGIN_SUCCESS
  useEffect(() => {
    const cbId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const authResult = event.payload as AuthenticationResult | null;
        const account = authResult?.account as AccountInfo | undefined;
        if (account) instance.setActiveAccount(account);
      }
    });
    return () => {
      if (cbId) instance.removeEventCallback(cbId);
    };
  }, [instance]);

  // โหลดข้อมูลอัตโนมัติหลัง login/redirect เสร็จ (inProgress === None)
  useEffect(() => {
    if (!isAuthenticated) return;
    if (inProgress !== InteractionStatus.None) return;
    if (hasFetchedRef.current) return;

    const account =
      instance.getActiveAccount() ?? (accounts.length > 0 ? accounts[0] : null);
    if (!account) {
      console.log("[Home] No active account yet.");
      return;
    }
    hasFetchedRef.current = true;

    const fetchUserData = async () => {
      try {
        if (!instance.getActiveAccount()) {
          instance.setActiveAccount(account);
        }

        const { idToken } = await instance.acquireTokenSilent({
          account,
          scopes: ["openid", "profile", "email"],
        });

        const { data } = await axios.post<LoginResponse>(ENDPOINTS.LOGIN, {
          token: idToken,
        });

        if (!data?.isSuccess || !data.result?.token) {
          throw new Error("Invalid backend response");
        }

        const { token, user } = data.result;
        sessionStorage.setItem("accessToken", token);
        if (user?.email) sessionStorage.setItem("Email", user.email);
        if (user?.firstName) sessionStorage.setItem("FirstName", user.firstName);
        if (user?.lastName) sessionStorage.setItem("LastName", user.lastName);


        // รีโหลดหน้าโดยอัตโนมัติหนึ่งครั้งหลังดึงข้อมูลสำเร็จ
        if (sessionStorage.getItem("didReloadOnce") !== "true") {
          sessionStorage.setItem("didReloadOnce", "true");
          window.location.reload();
        }
      } catch (error) {
        hasFetchedRef.current = false; // ให้ retry ได้
        console.error("[Home] Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, inProgress, instance, accounts]);


  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">KMUTT Authentication</h1>
        <button
          onClick={() => instance.loginRedirect()}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          {t('home.loginBtn')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans bg-white shadow-lg my-10 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {t('home.title')}
      </h1>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-2 border p-6 rounded-md">
          <h3 className="font-bold">{t('home.section1Title')}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {t('home.section1Body')}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 border p-6 rounded-md">
          <h3 className="font-bold">{t('home.section2Title')}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {t('home.section2Body')}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 border p-6 rounded-md">
          <h3 className="font-bold">{t('home.section3Title')}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {t('home.section3Body')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;