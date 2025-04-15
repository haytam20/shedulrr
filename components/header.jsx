"use client";

import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Calendar, BarChart, Users, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { motion } from 'framer-motion';


const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: BarChart },
  { href: "/events", label: "Événements", icon: Calendar },
  { href: "/meetings", label: "Réunions", icon: Users },
  { href: "/availability", label: "Disponibilité", icon: Clock },
];

function Header() {
  const pathname = usePathname();
  const { isLoaded } = useUser();

  return (
    <header className=" w-full bg-white relative overflow-hidden rounded-b-xl  p-1.5 backdrop-blur-lg dark:bg-gray-900/20  text-white flex items-center justify-between ">
      <nav className="w-full  relative overflow-hidden rounded-xl  p-1.5 backdrop-blur-lg dark:bg-gray-900/20">
      
  <ul className="flex items-center justify-between w-full gap-2">
  <div className="flex flex-wrap justify-center lg:ml-[23rem] flex-1 gap-1 md:gap-2">
    {navItems.map((item) => {
      const isActive = pathname === item.href;
      return (
        
        <li key={item.href} className="relative">
          <Link
            href={item.href}
            className={`group relative flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 md:px-4 ${
              isActive
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 rounded-lg bg-primary/10 dark:bg-primary/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <item.icon
              className={`h-5 w-5 transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}
            />
            <span>{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-12 rounded-full bg-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </Link>
        </li>
      );
    })}
    </div>
    <div className=" mr-4  md:mr-6 md:mt-1">
                    <Link href="/events?create=true">
                      <Button
                        variant="default"
                        className="text-gray-600 bg-white hover:bg-gray-30 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      >
                        <PenBox size={16} className="mr-2" />
                        <span className="hidden sm:inline">Créer un événement</span>
                      </Button>
                    </Link>
                  </div>
    <div className="flex items-center mr-5  gap-2">
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button
              variant="outline"
              className="border border-[#F7B84B] bg-transparent text-[#F7B84B] rounded-md hover:bg-[#F7B84B] hover:text-white text-sm font-medium"
            >
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
      
  </ul>
  
</nav>

      
    </header>
  );
}

export default Header;



