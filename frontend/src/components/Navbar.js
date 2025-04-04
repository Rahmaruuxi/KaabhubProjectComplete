"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HashtagIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  PlusIcon,
  TagIcon,
  NewspaperIcon,
  BookmarkIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Assuming the response data is stored in the user state
      // You might want to update the user state with the fetched data
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      localStorage.removeItem("token");
      setShowLogoutModal(false);
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navigation = user
    ? [
        { name: "Home", href: "/", icon: HomeIcon },
        { name: "Questions", href: "/questions", icon: QuestionMarkCircleIcon },
        { name: "Opportunities", href: "/opportunities", icon: BriefcaseIcon },
        { name: "Mentorship", href: "/mentorship", icon: AcademicCapIcon },
        { name: "About", href: "/about", icon: InformationCircleIcon },
        { name: "Contact", href: "/contact", icon: EnvelopeIcon },
        { name: "Posts", href: "/posts", icon: ChatBubbleLeftIcon },
      ]
    : [
        { name: "Home", href: "/", icon: HomeIcon },
        { name: "About", href: "/about", icon: InformationCircleIcon },
        { name: "Contact", href: "/contact", icon: EnvelopeIcon },
      ];

  const userNavigation = [
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="KAAB HUB Logo"
                  className="h-8 w-8 mr-2 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/32/136269/ffffff?text=KH";
                  }}
                />
                <span className="text-lg font-bold text-[#136269]">
                  KAAB HUB
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-[#136269]"
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                Home
              </Link>
              <Link
                to="/posts"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-[#136269]"
              >
                <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                Posts
              </Link>
              <Link
                to="/questions"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-[#136269]"
              >
                <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
                Questions
              </Link>
              <Link
                to="/opportunities"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-[#136269]"
              >
                <BriefcaseIcon className="h-5 w-5 mr-1" />
                Opportunities
              </Link>
              <Link
                to="/mentorships"
                className={`${
                  location.pathname === "/mentorships"
                    ? "border-primary-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <AcademicCapIcon className="h-5 w-5 mr-1" />
                Mentorships
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="relative group">
                <button
                  className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3] focus:ring-offset-2 transition-all duration-200"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {user.profilePicture ? (
                    <img
                      src={`http://localhost:5000${user.profilePicture}`}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-[#5DB2B3] hover:border-[#136269] transition-colors duration-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-[#5DB2B3] hover:border-[#136269] transition-colors duration-200">
                      <UserCircleIcon className="h-7 w-7 text-[#5DB2B3]" />
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">View Profile</span>
                  </div>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      isUserMenuOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {user.profilePicture ? (
                          <img
                            src={`http://localhost:5000${user.profilePicture}`}
                            alt="Profile"
                            className="h-10 w-10 rounded-full object-cover border-2 border-[#5DB2B3]"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-[#5DB2B3]">
                            <UserCircleIcon className="h-9 w-9 text-[#5DB2B3]" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#136269] transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#136269] transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 hover:text-[#136269]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#136269] hover:bg-[#0f4a52]"
                >
                  Register
                </Link>
              </div>
            )}
            {user && (
              <Link
                to="/notifications"
                className="p-2 text-gray-400 hover:text-[#136269] transition-colors duration-200"
              >
                <BellIcon className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#5DB2B3]"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  isActive(item.href)
                    ? "bg-[#136269]/10 text-[#136269]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
            {!user && (
              <div className="px-3 py-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-[#5DB2B3] hover:bg-[#5DB2B3]/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
            {user && (
              <div className="px-3 py-2 space-y-1">
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-3" />
                  Settings
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </div>
            )}
            <Link
              to="/scholarships"
              className={`${
                location.pathname === "/scholarships"
                  ? "bg-primary-50 border-primary-500 text-primary-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Scholarships
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <ArrowLeftOnRectangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sign Out
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to sign out? You'll need to sign in again
                to access your account.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5DB2B3]"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing out...
                  </>
                ) : (
                  "Sign Out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
