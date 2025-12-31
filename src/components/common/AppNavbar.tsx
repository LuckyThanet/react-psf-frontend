import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import liLogo from '../../assets/LI_logo.png';
interface AppNavbarProps {
    setLoginPopUp?: (value: boolean) => void;
    setLogOutPopup?: (value: boolean) => void;
}

const AppNavbar: React.FC<AppNavbarProps> = ({
    setLoginPopUp = () => { },
    setLogOutPopup = () => { },
}) => {
    // State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

    // Ref
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isSessionValid = (): boolean => {
        return !!sessionStorage.getItem('accessToken');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Navbar Container */}
            <nav className="bg-[#4b4f54] mb-[50px] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo Section */}
                        <div className="shrink-0">
                            <Link to="/">
                                <img
                                    className="h-[60px] w-auto"
                                    src={liLogo}
                                    alt="Your Logo"
                                />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:block w-full ml-10">
                            <div className="flex items-baseline justify-between space-x-4">
                                {/* Left Side Links */}
                                <div className="flex space-x-4">
                                    {/* {isSessionValid() && ( */}
                                    <div>
                                        <Link
                                            to="/form"
                                            className="text-gray-300  hover:text-white px-3 py-2 rounded-md text-base"
                                        >
                                            แบบประเมิน
                                        </Link>
                                        <Link
                                            to="/result"
                                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base"
                                        >
                                            ผลการประเมิน
                                        </Link>
                                    </div>
                                    {/* )} */}
                                </div>

                                {/* Right Side (User Profile / Login) */}
                                <div className="ml-4 relative" >
                                    {isSessionValid() && (
                                        <div className="flex items-center text-gray-300">
                                            <span className="font-medium">
                                                {[
                                                    sessionStorage.getItem("FirstName") ||
                                                    sessionStorage.getItem("userFirstName") ||
                                                    sessionStorage.getItem("given_name"),
                                                    sessionStorage.getItem("LastName") ||
                                                    sessionStorage.getItem("family_name"),
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ") || "ผู้ใช้"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button (Hamburger) */}
                        <div className="-mr-2 flex lg:hidden">
                            <button
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

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-[#4b4f54] pb-3">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {isSessionValid() && (
                                <>
                                    <Link to="/form" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                        แบบประเมิน
                                    </Link>
                                    <Link to="/result" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                        ผลการประเมิน
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="pt-4 pb-3 border-t border-gray-700">

                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default AppNavbar;