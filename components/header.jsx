import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { checkUser } from "@/lib/checkUser";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { PenBox, Search } from "lucide-react";

async function Header() {
  await checkUser();
  
  return (
    <header className="w-full bg-transparent text-white flex items-center justify-between p-4">
      
      
      <div className="flex items-center gap-2">
        {/* <Link href="/events?create=true">
          <Button 
            variant="default" 
            className="bg-gray-900 hover:bg-white text-white hover:text-black px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 border border-white"
          >
            <PenBox size={16} />
            <span className="hidden sm:inline">Créer un événement</span>
          </Button>
        </Link> */}

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
    </header>
  );
}

export default Header;