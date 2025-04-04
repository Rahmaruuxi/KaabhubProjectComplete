import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  MapPinIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Mentorships = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    status: "open",
  });
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchMentorships();
  }, [filters, sortBy]);

  const fetchMentorships = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.category) queryParams.append("category", filters.category);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.status) queryParams.append("status", filters.status);
      queryParams.append("sort", sortBy);

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `http://localhost:5000/api/mentorships/filter?${queryParams}`,
        { headers }
      );
      setMentorships(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching mentorships:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch mentorships. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentorship?"))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(`http://localhost:5000/api/mentorships/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMentorships(mentorships.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Error deleting mentorship:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete mentorship. Please try again later."
      );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "programming":
        return <BriefcaseIcon className="h-5 w-5 text-[#136269]" />;
      case "design":
        return <BriefcaseIcon className="h-5 w-5 text-[#136269]" />;
      case "business":
        return <BriefcaseIcon className="h-5 w-5 text-[#136269]" />;
      case "marketing":
        return <BriefcaseIcon className="h-5 w-5 text-[#136269]" />;
      default:
        return <BriefcaseIcon className="h-5 w-5 text-[#136269]" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-[#5DB2B3] text-white";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#136269]"></div>
        <span className="ml-3 text-gray-500">Loading mentorships...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchMentorships}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#136269] hover:bg-[#0d4a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#136269] mb-4">
            Mentorship Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find mentors and mentees to share knowledge and grow together
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AcademicCapIcon className="h-5 w-5 text-[#136269]" />
              </div>
              <input
                type="text"
                placeholder="Search mentorships..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#136269] focus:border-[#136269] transition duration-150 ease-in-out sm:text-sm"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#136269] focus:border-[#136269] sm:text-sm rounded-lg transition duration-150 ease-in-out"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Create Mentorship Button */}
        <div className="flex justify-end mb-8">
          {user && (
            <button
              onClick={() => navigate("/create-mentorship")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#136269] hover:bg-[#0d4a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269] transition duration-150 ease-in-out"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Mentorship
            </button>
          )}
        </div>

        {/* Mentorships Grid */}
        {mentorships.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-[#136269] mb-6">
              <AcademicCapIcon className="h-full w-full" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No mentorships found
            </h3>
            <p className="text-gray-500 mb-8">
              {filters.category || filters.search || filters.status
                ? "Try adjusting your filters"
                : "Be the first to create a mentorship opportunity!"}
            </p>
            {user && (
              <button
                onClick={() => navigate("/create-mentorship")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#136269] hover:bg-[#0d4a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269] transition duration-150 ease-in-out"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Mentorship
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorships.map((mentorship) => (
              <div
                key={mentorship._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getCategoryIcon(mentorship.category)}
                      <span className="ml-2 text-sm font-medium text-[#136269] capitalize">
                        {mentorship.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#136269] transition-colors duration-200">
                    {mentorship.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {mentorship.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ClockIcon className="h-4 w-4 mr-1 text-[#136269]" />
                    <span>{mentorship.duration} months</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      {mentorship.mentor && mentorship.mentor.profilePicture ? (
                        <img
                          src={
                            mentorship.mentor.profilePicture.startsWith("http")
                              ? mentorship.mentor.profilePicture
                              : `http://localhost:5000${mentorship.mentor.profilePicture}`
                          }
                          alt={mentorship.mentor.name}
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-[#136269]/10"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "http://localhost:5000/uploads/profiles/default.png";
                          }}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-[#136269]/10 flex items-center justify-center ring-2 ring-[#136269]/10">
                          <span className="text-sm font-medium text-[#136269]">
                            {mentorship.mentor?.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <span className="ml-2 text-sm text-gray-600">
                        {mentorship.mentor?.name || "Unknown User"}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      {user &&
                        mentorship.mentor &&
                        mentorship.mentor._id === user._id && (
                          <>
                            <button
                              onClick={() =>
                                navigate(`/edit-mentorship/${mentorship._id}`)
                              }
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-[#136269] hover:bg-[#136269]/10 transition-colors duration-200"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(mentorship._id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </>
                        )}
                      {user &&
                        mentorship.status === "open" &&
                        mentorship.mentor &&
                        mentorship.mentor._id !== user._id && (
                          <button
                            onClick={() =>
                              navigate(`/mentorship/${mentorship._id}`)
                            }
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#136269] hover:bg-[#0d4a50] transition-colors duration-200 shadow-sm"
                          >
                            Request Mentorship
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentorships;
