"use client";
import { Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white/80 px-8 backdrop-blur-md border-b border-gray-200">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search customers, tasks, leads..."
          className="w-80 rounded-lg bg-gray-100 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell
          size={20}
          className="cursor-pointer text-gray-500 hover:text-gray-900"
        />
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
          AD
        </div>
      </div>
    </nav>
  );
}