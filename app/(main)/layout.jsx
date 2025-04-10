"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, BarChart, Users, Clock, PenBox, Menu, X } from "lucide-react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: BarChart },
  { href: "/events", label: "Événements", icon: Calendar },
  { href: "/meetings", label: "Réunions", icon: Users },
  { href: "/availability", label: "Disponibilité", icon: Clock },
];

export function MetricCard({ icon: Icon, title, value }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center mr-3 sm:mr-4">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#5F9EE9]" />
        </div>
        <div>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function ContentCard({ title, actionLabel, actionUrl, children }) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 gap-2">
        <h2 className="text-base sm:text-lg font-medium text-gray-800">{title}</h2>
        {actionLabel && (
          <Link
            href={actionUrl || "#"}
            className="bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap"
          >
            {actionLabel}
          </Link>
        )}
      </div>
      <div className="p-1">{children}</div>
    </div>
  );
}

export function ActionButton({ label, primary = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
        primary
          ? "bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white"
          : "bg-gray-800 hover:bg-gray-700 text-white"
      }`}
    >
      {label}
    </button>
  );
}

export function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "en cours":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "terminé":
      case "terminer":
        return "bg-green-100 text-green-800 border border-green-200";
      case "replanifier":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
}

export function DataTable({ columns, data, actionLabel = "Accéder" }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column, idx) => (
              <th key={idx} className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="bg-white hover:bg-gray-50 transition-colors duration-150">
              {Object.keys(row).map((key, cellIdx) => {
                if (key === "status") {
                  return (
                    <td key={cellIdx} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <StatusBadge status={row[key]} />
                    </td>
                  );
                } else if (key === "action") {
                  return (
                    <td key={cellIdx} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <ActionButton label={actionLabel} primary />
                    </td>
                  );
                }
                return (
                  <td
                    key={cellIdx}
                    className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${
                      key === "title" ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}
                  >
                    {row[key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-lg shadow-sm">
      <p className="text-xs sm:text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-lg sm:text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Handle window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isMobile = windowWidth < 768;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {!isLoaded && <BarLoader width="100%" color="#5F9EE9" />}

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Navigation Bar */}
            <nav className="relative overflow-hidden rounded-t-xl bg-white shadow-sm p-1.5 backdrop-blur-sm dark:bg-gray-900/80">
              {/* Mobile Menu Button */}
              <div className="md:hidden flex justify-between items-center px-2">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
                
                <Link href="/events?create=true" className="inline-block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-black text-black hover:bg-gray-100 hover:border-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                    aria-label="Créer un événement"
                  >
                    <PenBox size={16} />
                    <span className="sr-only sm:not-sr-only sm:inline">Créer</span>
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu */}
              <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} mt-2`}>
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                            isActive
                              ? "bg-[#5F9EE9]/10 text-[#5F9EE9]"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5",
                              isActive ? "text-[#5F9EE9]" : "text-gray-500"
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <ul className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href} className="relative">
                        <Link
                          href={item.href}
                          className={cn(
                            "group relative flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 md:px-4",
                            isActive
                              ? "text-[#5F9EE9]"
                              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeBackground"
                              className="absolute inset-0 rounded-lg bg-[#5F9EE9]/10 dark:bg-[#5F9EE9]/20"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                          <item.icon
                            className={cn(
                              "h-5 w-5 transition-all duration-200",
                              isActive
                                ? "text-[#5F9EE9]"
                                : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                            )}
                          />
                          <span>{item.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-12 rounded-full bg-[#5F9EE9]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 md:right-4">
                  <Link href="/events?create=true" className="inline-block">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-black text-black hover:bg-gray-100 hover:border-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                      aria-label="Créer un événement"
                    >
                      <PenBox size={16} className="mr-2" />
                      <span>Créer un événement</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Main Content Area */}
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="bg-white rounded-b-xl shadow-sm p-3 sm:p-4 md:p-6"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}