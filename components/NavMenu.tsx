"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import LocaleSwitcher from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export const NavMenu = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-gray-950 bg-black text-white p-4 flex items-center justify-between w-full">
      <div className="flex items-center justify-between w-full max-w-[1280px] mx-auto ">
        <Link href="/">
          <p className="text-xl font-bold">Quiz master</p>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center ">
          <ThemeToggle />
          <LocaleSwitcher />
          <Link href="/"><p className="hover:underline">Home</p></Link>
          {session ? (
            <>
              <span>Welcome, {session.user?.name || session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="text-white md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "Close" : "Menu"}
        </button>

        {/* Mobile Menu Items */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-gray-900 flex flex-col items-center md:hidden space-y-4 p-4">
            <Link href="/">
              <p className="block w-full text-center hover:underline">Home</p>
            </Link>

            {session ? (
              <>
                <span className="block w-full text-center">
                  Hello, {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 w-full py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};