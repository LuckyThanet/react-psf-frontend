import { useMsal, useIsAuthenticated } from "@azure/msal-react";

function HomePage() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  // CASE 1: User is not authenticated
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

  const account = accounts[0];
  // CASE 2: User is authenticated
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