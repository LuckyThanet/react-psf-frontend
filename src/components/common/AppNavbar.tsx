import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import liLogo from '../../assets/LI_logo.png';
import { useMsal } from "@azure/msal-react";
import { useTranslation } from 'react-i18next';

interface AppNavbarProps {
    setLoginPopUp?: (value: boolean) => void;
    setLogOutPopup?: (value: boolean) => void;
}

const AppNavbar: React.FC<AppNavbarProps> = () => {
    // State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const { instance } = useMsal();
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th');
    };
    const isSessionValid = (): boolean => {
        return !!sessionStorage.getItem('accessToken');
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            sessionStorage.removeItem("didReloadOnce");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("FirstName");
            sessionStorage.removeItem("LastName");
            sessionStorage.removeItem("Email");

            const acct = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
            await instance.logoutRedirect({
                account: acct,
                postLogoutRedirectUri: "/",
            });
        } catch (e) {
            console.error("Logout error:", e);
            // window.location.assign("/");
            navigate("/");
        } finally {
            setLoggingOut(false);
        }
    };

    // Helper function เพื่อดึงชื่อ (ใช้ซ้ำได้ทั้ง Desktop และ Mobile)
    const getUserName = () => {
        return [
            sessionStorage.getItem("FirstName") ||
            sessionStorage.getItem("userFirstName") ||
            sessionStorage.getItem("given_name"),
            sessionStorage.getItem("LastName") ||
            sessionStorage.getItem("family_name"),
        ]
            .filter(Boolean)
            .join(" ") || t('nav.defaultUser');
    };

    return (
        <div>
            <nav className="bg-[#4b4f54] mb-[50px] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="shrink-0">
                            <Link to="/">
                                <img className="h-[60px] w-auto" src={liLogo} alt="Your Logo" />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:block w-full ml-10">
                            <div className="flex items-center justify-between">
                                {/* Links Group */}
                                <div className="flex space-x-4">
                                    <Link to="/form" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base">
                                        {t('nav.form')}
                                    </Link>
                                    <Link to="/result" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base">
                                        {t('nav.result')}
                                    </Link>
                                </div>

                                {/* User & Logout Group (จัด Flex ให้ตรงกัน) */}
                                <div className="ml-4 flex items-center gap-4">
                                    {/* Language Switcher */}
                                    <button
                                        type="button"
                                        onClick={toggleLanguage}
                                        className="px-3 py-1 border border-gray-400 text-gray-300 rounded hover:border-white hover:text-white text-sm transition"
                                    >
                                        {i18n.language === 'th' ? 'EN' : 'TH'}
                                    </button>
                                    {isSessionValid() && (
                                        <>
                                            <div className="text-gray-300 font-medium">
                                                {getUserName()}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                disabled={loggingOut}
                                                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60 transition"
                                            >
                                                {loggingOut ? t('nav.loggingOut') : t('nav.logout')}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex lg:hidden">
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-[#4b4f54] pb-3 border-t border-gray-600">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {/* Mobile Language Switcher */}
                            <button
                                type="button"
                                onClick={toggleLanguage}
                                className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {i18n.language === 'th' ? 'English (EN)' : 'ภาษาไทย (TH)'}
                            </button>
                            {isSessionValid() && (
                                <>
                                    <Link to="/form" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                        {t('nav.form')}
                                    </Link>
                                    <Link to="/result" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                        {t('nav.result')}
                                    </Link>

                                    {/* Mobile User Info & Logout Separator */}
                                    <div className="border-t border-gray-600 my-2 pt-2">
                                        <div className="text-gray-300 block px-3 py-2 text-base font-medium">
                                            {t('nav.greeting', { name: getUserName() })}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="w-full text-left text-red-300 hover:bg-red-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition"
                                        >
                                            {loggingOut ? t('nav.loggingOut') : t('nav.logout')}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default AppNavbar;