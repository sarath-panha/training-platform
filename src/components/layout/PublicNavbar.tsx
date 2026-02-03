"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  ShieldCheck,
  User,
  LogOut,
} from "lucide-react";

export const PublicNavbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-none">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Ecodent
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/mentors"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Mentors
            </Link>
            <Link
              href="/business"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              For Clinics
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200" />

            {status === "authenticated" && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <span className="text-sm font-medium text-slate-700 block leading-none">
                      {session.user.name?.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      {(session.user as any).role}
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-slate-900">
                          {session.user.name}
                        </p>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border 
                          ${
                            (session.user as any).role === "admin"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : (session.user as any).role === "instructor"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {(session.user as any).role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      {/* Admin Link */}
                      {(session.user as any).role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 border-b border-slate-50"
                        >
                          Go to Admin Console
                        </Link>
                      )}
                      <Link
                        href="/my-learning"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        My Learning
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Account Settings
                      </Link>
                    </div>
                    <div className="border-t border-slate-50 py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-sm font-medium text-slate-900 hover:text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  href="/auth"
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors rounded-none"
                >
                  Join for Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              href="/courses"
              className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              Browse Courses
            </Link>
            <Link
              href="/mentors"
              className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              Mentors
            </Link>
            <Link
              href="/business"
              className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              For Clinics
            </Link>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3 px-3">
              {status === "authenticated" && session?.user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/my-learning"
                    className="block w-full text-left py-2 text-slate-700 font-medium hover:bg-slate-50"
                  >
                    My Learning
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left py-2 text-rose-600 font-medium hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="w-full text-center py-2 border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth"
                    className="w-full text-center py-2 bg-slate-900 text-white font-medium hover:bg-slate-800"
                  >
                    Join for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
