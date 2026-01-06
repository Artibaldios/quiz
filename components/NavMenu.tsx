"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { User, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeSwitcher  from "./ThemeSwitcher";
import { useTranslations } from "next-intl";

export const NavMenu = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const t = useTranslations("navMenu");

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 supports-[backdrop-filter:blur()]:bg-white/60 supports-[backdrop-filter:blur()]:dark:bg-zinc-900/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Quiz Master
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {session ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-3 space-x-2 p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-all duration-200 group relative cursor-pointer"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 bg-linear-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-md font-bold text-gray-700 dark:text-gray-300 hidden lg:block">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-900 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl py-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-md font-bold text-gray-900 dark:text-white">
                        {session.user?.name || session.user?.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user?.email}
                      </p>
                    </div>
                    
                    <div className="space-y-1 px-2 pt-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center space-x-3 px-4 py-3 text-sm rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all duration-200 group"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600">{t("profile")}</span>
                      </Link>
                      
                      <ThemeSwitcher text={true}/>
                      
                      <LocaleSwitcher />
                      
                      <button
                        onClick={() => {
                          signOut();
                          setProfileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group cursor-pointer"
                      >
                        <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-red-600">{t("logout")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4 justify-center items-center">
                <ThemeSwitcher text={false}/>
                <button
                  onClick={() => signIn()}
                  className="px-5 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-textColor" />
            ) : (
              <Menu className="w-6 h-6 text-textColor" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/80 dark:bg-zinc-900/80 shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {session ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/profile" 
                    className="flex items-center space-x-3 w-full px-4 py-3 text-textColor font-medium rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 shrink-0" />
                    <span>{t("profile")}</span>
                  </Link>
                  <ThemeSwitcher text={true}/>
                  <LocaleSwitcher />
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-textColor font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 mt-2"
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span>{t("logout")}</span>
                  </button>
                </div>
            ) : (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <ThemeSwitcher text={true}/>
              <LocaleSwitcher />
              <button
                onClick={() => {
                  signIn();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                {t("SignIn")}
              </button>
            </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};