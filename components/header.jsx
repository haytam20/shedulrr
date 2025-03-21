import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { checkUser } from "@/lib/checkUser";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { PenBox, Search } from "lucide-react";
import Ologo from "./Ologo.PNG";
async function Header() {
  await checkUser();

  return (
    <nav className="w-full bg-white py-3 px-6 flex justify-between items-center shadow-sm border-b border-gray-200">
       <Link href="/" className="flex items-center mb-6">
      
      <Image
        src={Ologo}
        alt="Logo"
        width={140} 
        height={100} 
        className="h-10" 
      />
    </Link>
      <div className="flex items-center gap-4">
        <Link href="/events?create=true">
          <Button 
            variant="default" 
            className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-none text-sm font-medium flex items-center gap-2"
          >
            <PenBox size={16} />
            <span className="hidden sm:inline">Créer un événement</span>
          </Button>
        </Link>
        
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button 
              variant="outline"
              className="border border-gray-300 bg-white text-gray-800 rounded-none hover:bg-gray-50 text-sm font-medium"
            >
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Header;