"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import React from "react";
import {FaHome, FaPlusCircle, FaUser, FaSearch, FaPlay} from "react-icons/fa";
import UploadForm from "./UploadForm";
import Cookie from "js-cookie";

const Navbar: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = !!Cookie.get("token");
  const role = Cookie.get("role");

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("role");
    Cookie.remove("username");
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <FaPlay className="text-white" />
            </div>
            <span className="ml-2 text-xl font-bold">ClipWave</span>
          </Link>

          {/* Search Bar */}
          {/* <div className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full px-4 py-2 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div> */}

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* <Link href="/" className="p-2 rounded-full hover:bg-gray-700">
              <FaHome size={20} />
            </Link> */}

            {isAuthenticated && (
              <>
                {role && role === "creator" && <UploadForm />}
                {/* <button
                  onClick={() => router.push("/profile")}
                  className="p-2 rounded-full hover:bg-gray-700"
                >
                  <FaUser size={20} />
                </button> */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
