import React from 'react';
import CoverWeb from '../assets/cover_web.jpg';
import { useNavigate } from 'react-router-dom';
// ส่วนประกอบย่อย: Copyright
const Copyright: React.FC = () => {
  return (
    <p className="mt-8 text-center text-xs text-gray-500">
      {'Copyright © '}
      {new Date().getFullYear()}
      {' Learning Institute King Mongkut’s University of Technology Thonburi, All rights reserved.'}
    </p>
  );
};

// ส่วนประกอบย่อย: Logo
const FluidLogo: React.FC = () => {
  return (
    <div className="text-center mb-6">
      {/* ตรวจสอบ path รูปภาพให้ถูกต้อง */}
      <img src="/kmutt.png" alt="KMUTT Logo" className="mx-auto w-32 h-auto" />
    </div>
  );
};

export default function LoginPage() {

  const navigate = useNavigate();
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // นำทางไปยังหน้า Home หลังจากล็อกอินสำเร็จ
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full">

      {/* --------------------------------------------------------- */}
      {/* ฝั่งซ้าย: รูปภาพ Background (ซ่อนเมื่อจอเล็ก) */}
      {/* --------------------------------------------------------- */}
      <div
        className="hidden md:block md:w-2/3 lg:w-3/4 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${CoverWeb})` }}
      >
        {/* ถ้าต้องการ Layer สีทับภาพ ให้ uncomment บรรทัดล่าง */}
        {/* <div className="absolute inset-0 bg-black/10"></div> */}
      </div>

      {/* --------------------------------------------------------- */}
      {/* ฝั่งขวา: ฟอร์ม Login */}
      {/* --------------------------------------------------------- */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white flex flex-col justify-center px-6 py-12 lg:px-8 shadow-xl z-10">

        {/* Header: Logo & Title */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <FluidLogo />
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in
          </h2>
        </div>

        {/* Form Section */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>

            {/* Button: Login */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-colors"
              >
                Log in
              </button>
            </div>
          </form>



          {/* Footer Copyright */}
          <Copyright />

        </div>
      </div>
    </div>
  );
}