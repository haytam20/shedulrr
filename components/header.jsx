"use client";

import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Calendar, BarChart, Users, Clock, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Logo1 from "../public/logo1.png";

const navItems = [
  { href: "/dashboard", label: "Tablero", icon: BarChart },
  { href: "/events", label: "Eventos", icon: Calendar },
  { href: "/meetings", label: "Reuniones", icon: Users },
  { href: "/availability", label: "Disponibilidad", icon: Clock },
];

function Header() {
  const pathname = usePathname();
  const { isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <Image
                src={Logo1}
                alt="Logo de la empresa"
                width={80}
                height={80}
                
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Navegación principal">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 rounded-lg bg-blue-50 dark:bg-blue-950/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <item.icon className="h-4 w-4" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center space-x-1" aria-label="Navegación móvil">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Create Event Button */}
            <Link href="/events?create=true">
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Crear evento</span>
                <span className="sm:hidden">Crear</span>
              </Button>
            </Link>

            {/* Auth Section */}
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Iniciar sesión
                </Button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              {isLoaded ? (
                <UserMenu />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse dark:bg-gray-700" />
              )}
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;