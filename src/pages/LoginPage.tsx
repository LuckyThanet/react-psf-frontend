

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">KMUTT Authentication</h1>
      <button 
        // คำสั่งกระโดดไปหน้า ADFS
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Login with KMUTT Account
      </button>
    </div>
  )
}

export default LoginPage