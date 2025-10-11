"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Search } from "lucide-react";

const Navbar = () => {
  const { user, isLoaded } = useUser();
  return (
    <nav className="border border-b-black p-4">
      <div className="flex justify-between">
        <div className="relative w-[400px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search"
            className="border border-black rounded-2xl p-2 pl-10 w-full focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
