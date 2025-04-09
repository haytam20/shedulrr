"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, BarChart, Users, Clock, Search, Menu, X } from "lucide-react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: BarChart },
  { href: "/events", label: "Événements", icon: Calendar },
  { href: "/meetings", label: "Réunions", icon: Users },
  { href: "/availability", label: "Disponibilité", icon: Clock },
];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {!isLoaded && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <BarLoader width={"100%"} color="#5F9EE9" />
        </div>
      )}
      <div className="flex flex-col h-screen bg-[#FFFFFF]">
        {/* Top Navigation */}
        <nav className={`sticky top-0 z-10 bg-white ${isScrolled ? 'shadow-lg' : 'border-b border-[#5F9EE9]/20'} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Mobile menu button */}
              <div className="flex md:hidden">
                <button
                  className="p-2 rounded-md text-[#2A3142] hover:text-[#5F9EE9] hover:bg-[#5F9EE9]/10 focus:outline-none focus:ring-2 focus:ring-[#5F9EE9] focus:ring-opacity-50 transition-colors duration-200"
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  aria-label="Toggle navigation menu"
                >
                  {mobileNavOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
              
              {/* Centered desktop navigation */}
              <div className="hidden md:flex flex-1 justify-center">
                <div className="flex space-x-1 bg-[#5F9EE9]/10 rounded-lg p-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                        pathname === item.href 
                          ? "text-white bg-[#5F9EE9] shadow-inner" 
                          : "text-[#2A3142] hover:bg-[#5F9EE9]/20 hover:text-[#4A8BD6]"
                      }`}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      <item.icon className={`w-5 h-5 mr-2 ${pathname === item.href ? "text-white" : "text-[#5F9EE9]"}`} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Empty div to balance the flex layout */}
              <div className="md:hidden w-10"></div>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileNavOpen && (
            <div className="md:hidden bg-white border-b border-[#5F9EE9]/20 shadow-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-3 rounded-md text-base font-semibold transition-colors duration-200 ${
                      pathname === item.href 
                        ? "text-white bg-[#5F9EE9]" 
                        : "text-[#2A3142] hover:bg-[#5F9EE9]/10 hover:text-[#4A8BD6]"
                    }`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#FFFFFF] p-4 md:p-6 pb-16 md:pb-6">
          {children}
        </main>

        {/* Bottom Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-[#5F9EE9]/20 z-10">
          <ul className="flex justify-around">
            {navItems.map((item) => (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center py-3 px-4 transition-colors duration-200 ${
                    pathname === item.href 
                      ? "text-[#5F9EE9] bg-[#5F9EE9]/10" 
                      : "text-[#808487] hover:text-[#5F9EE9]"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}