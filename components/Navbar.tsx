"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const path = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileImage =
    user?.user_metadata?.picture || // Google
    user?.user_metadata?.avatar_url || // GitHub
    "/default-avatar.png"; // fallback

  return (
    <div
      className={`h-16 w-full px-4 md:px-8 py-2 ${
        path === "/signin" ? "hidden" : "flex"
      }  justify-between items-center bg-white border-b border-gray-100  `}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <Image
          src="/logo.svg"
          alt="LetterFox logo"
          width={56}
          height={56}
          className="transition-transform duration-200 group-hover:scale-105"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Letter<span className="italic text-gray-800">Fox</span>
        </h1>
      </Link>

      {/* Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 px-4 py-1 transition hover:bg-gray-200 rounded-xl"
        >
          {/* Avatar */}
          <div className="overflow-hidden bg-green-500 rounded-full size-10 md:size-12">
            <Image src={profileImage} alt="" width={50} height={50} />
          </div>
          {/* Name + Email */}
          <div className="hidden text-left md:block">
            <h1 className="text-lg font-semibold leading-tight">
              {user?.user_metadata?.name ?? "userName"}
            </h1>
            <p className="text-sm text-gray-600">
              {user?.email ?? "user123@gmail.com"}
            </p>
          </div>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 z-50 w-40 mt-2 bg-white border rounded-lg shadow-lg">
            <button
              onClick={signOut}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 "
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
