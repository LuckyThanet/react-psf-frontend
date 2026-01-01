import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import axios from "axios";
import { useEffect, useRef } from "react";
import { ENDPOINTS } from "../constants/endpoint";

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
          ENDPOINTS.LOGIN,
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


  return (
    <div className="max-w-6xl mx-auto p-6 font-sans bg-white shadow-lg my-10 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">แบบสำรวจเพื่อการพัฒนาตนเองตามกรอบ KMUTT PSF (Teaching and Supporting Learning)</h1>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-2 border p-6 rounded-md">
          <h3 className="font-bold">แบบสำรวจนี้พัฒนาขึ้นเพื่ออะไร?</h3>
          <p className="text-sm text-gray-600 mt-2">แบบสำรวจเพื่อการพัฒนาตนเองชุดนี้จัดทำขึ้นเพื่อให้ท่านได้ลองประเมินตนเองว่าใน KMUTT Professional Standards Framework for teaching and supporting learning (KMUTT PSF) ระดับ Competent และ Proficient ท่านมีสมรรถนะใดแล้วบ้าง และเสนอแนะในส่วนที่ท่านอาจเพิ่มเติม และแนะนำกิจกรรมหรือแหล่งเรียนรู้ที่จะช่วยพัฒนาการจัดการเรียนรู้ของท่าน และท่านอาจใช้ข้อมูลเหล่านี้ประกอบในการตัดสินใจขอรับรอง KMUTT PSF ด้านการจัดการเรียนการสอน</p>
        </div>
        <div className="grid grid-cols-1 gap-2 border p-6 rounded-md">
          <h3 className="font-bold">แบบสำรวจนี้นำไปใช้อย่างไร?</h3>
          <p className="text-sm text-gray-600 mt-2">แบบสำรวจนี้เราได้นำแต่ละองค์ประกอบที่ระบุใน KMUTT PSF (Teaching and Support Learning) ระดับ Competent และ Proficient มา regroup มาถอดเป็นคำถามเพียง 8 ข้อ เป็นคำถามแบบ checklist ที่ให้ท่านเลือกตอบข้อที่ตรงกับการจัดการเรียนการสอนของท่านใช้เวลาตอบประมาณ 3-5 นาที คำตอบจะถูกนำไปแปรผลโดย map กลับไปที่สมรรถนะที่ระบุไว้ของแต่ละระดับ ผลที่ออกมานั้นเป็นเพียงการคาดคะเนสมรรถนะจากคำตอบที่มาจากประสบการณ์ของท่านเท่านั้น คำตอบจึงใช้เป็นเพียงแนวทางในการพิจารณาเบื้องต้นมิได้นำไปสู่การสรุปผลว่าท่านผ่านหรือไม่ผ่านสมรรถนะในระดับใด</p>
        </div>
        <div className="grid grid-cols-1 gap-2 border p-6 rounded-md">
          <h3 className="font-bold">ข้อมูลจากคำตอบของท่านจะนำไปทำอะไร</h3>
          <p className="text-sm text-gray-600 mt-2">ข้อมูลของท่านจะถูกเก็บไว้เพื่อให้ท่านสามารถเรียกดูผลของแบบสำรวจที่ท่านทำไปแล้ว และในขณะเดียวกันเราจะนำข้อมูลไปออกแบบการพัฒนาการจัดการเรียนรู้เพื่อให้ตรงกับความต้องการของประชาคม มจธ. ผู้ที่จะสามารถเข้าถึงข้อมูลรายบุคคลได้ จะเป็นผู้ที่เกี่ยวข้องกับการพัฒนาอาจารย์เท่านั้น ข้อมูลที่นำเสนอต่อผู้บริหารมหาวิทยาลัย จะเป็นข้อมูลภาพรวมของหน่วยงานและของมหาวิทยาลัยเท่านั้น</p>
        </div>
      </div>
      <div className="w-full flex flex-col justify-end items-end">
        <button
          onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default HomePage;