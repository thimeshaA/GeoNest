import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Boxes } from "./ui/background-boxes";

export default function Layout({ children, darkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="flex static w-full top-0 items-center justify-between p-4 shadow-md bg-white dark:bg-gray-800 z-10">
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-md">
            <div className="absolute w-5 h-5 bg-white dark:bg-gray-900 rounded-full"></div>
            <div className="absolute w-6 h-6 border-2 border-white dark:border-gray-900 rounded-full"></div>
            <div className="absolute w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <span className="font-bold text-xl">GeoNest</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <span className="font-medium">{user.username}</span>
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 z-50">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-400"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600"
              >
                Sign up
              </Link>
            </div>
          )}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="text-xl p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>
      <div className=" fixed inset-0 w-full h-lvh overflow-hidden">
        {/* <ShootingStars className="z-0" /> */}
        <Boxes className="z-0 " />
      </div>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
        <p>&copy; 2025 GeoNest. All rights reserved.</p>
        <p>Done by Thimesha Ansar</p>
      </footer>
    </div>
  );
}
