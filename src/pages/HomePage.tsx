import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import axios from "axios";
import { useEffect, useRef } from "react";

function HomePage() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const hasFetchedRef = useRef(false);

  type LoginResponse = {
    isSuccess: boolean;
    result: {
      token: string;
      user: { email: string; firstName: string; lastName: string };
    };
  };

  useEffect(() => {
    if (!isAuthenticated) return;
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

        const { data } = await axios.post<LoginResponse>(
          "http://localhost:3000/api/login",
          { token: idToken }        );

        if (!data?.isSuccess || !data.result?.token) {
          throw new Error("Invalid backend response");
        }

        const { token, user } = data.result;
        sessionStorage.setItem("accessToken", token);
        if (user?.email) sessionStorage.setItem("Email", user.email);
        if (user?.firstName) sessionStorage.setItem("FirstName", user.firstName);
        if (user?.lastName) sessionStorage.setItem("LastName", user.lastName);

        console.log("[Home] User data stored.");
      } catch (error) {
        // Allow retry on next render if needed
        hasFetchedRef.current = false;
        console.error("[Home] Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, instance, accounts]);

  console.log("Accounts:", accounts);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">KMUTT Authentication</h1>
        <button
          onClick={() => instance.loginRedirect()}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Login with KMUTT Account
        </button>
      </div>
    );
  }

  const account = instance.getActiveAccount() ?? accounts[0];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Login สำเร็จ! 🎉</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="font-bold">User Info:</p>
        <pre className="text-sm text-gray-600 mt-2">{JSON.stringify(account, null, 2)}</pre>
      </div>
      <button
        onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Log out
      </button>
    </div>
  );
}

export default HomePage;