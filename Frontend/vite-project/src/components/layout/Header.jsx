import React from "react";
import MenuIcon from "../common/MenuIcon";
import "./header.css";

const Header = ({ onMenuClick, onAuthClick, onLogout, isLoggedIn, user }) => {
  return (
    <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-white relative">
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-purple-50 transition cursor-pointer"
        aria-label="Open conversation menu"
      >
        <MenuIcon />
      </button>

      {/* Title always centered */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
        MindEase AI
      </h1>

      {/* Auth Buttons */}
      <div className="ml-auto flex items-center space-x-3">
        {isLoggedIn ? (
          <div className="flex items-center space-x-3">
            {user?.fullName && (
              <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                Hi, {user.fullName.split(" ")[0]}
              </span>
            )}
            <button
              onClick={onLogout}
              className="px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            className="px-4 py-2 text-sm font-semibold rounded-full shadow-md login-btn cursor-pointer"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
