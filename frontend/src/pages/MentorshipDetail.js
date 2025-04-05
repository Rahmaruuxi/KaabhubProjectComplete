import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import MentorshipChat from "../components/MentorshipChat";
import {
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const MentorshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentorship, setMentorship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    fetchMentorshipDetails();
  }, [id]);

  const fetchMentorshipDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `http://localhost:5000/api/mentorships/${id}`,
        { headers }
      );
      setMentorship(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching mentorship details:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch mentorship details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to request mentorship");
      }

      const response = await axios.post(
        `http://localhost:5000/api/mentorships/${id}/request`,
        { message: requestMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMentorship(response.data);
      setRequestStatus("success");
      setRequestMessage("");
    } catch (error) {
      console.error("Error requesting mentorship:", error);
      setRequestStatus("error");
      alert(
        error.response?.data?.message ||
          "Failed to request mentorship. Please try again later."
      );
    }
  };

  const handleDelete = async () => {
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
      navigate("/mentorships");
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
      case "academic":
        return <AcademicCapIcon className="h-5 w-5 text-[#136269]" />;
      case "technical":
        return <BriefcaseIcon className="h-5 w-5 text-[#136269]" />;
      case "research":
        return <AcademicCapIcon className="h-5 w-5 text-[#136269]" />;
      default:
        return <AcademicCapIcon className="h-5 w-5 text-[#136269]" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-[#5DB2B3] text-white";
      case "closed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#136269]"></div>
        <span className="ml-3 text-gray-500">
          Loading mentorship details...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchMentorshipDetails}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#136269] hover:bg-[#0d4a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!mentorship) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Mentorship not found</div>
        <button
          onClick={() => navigate("/mentorships")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#136269] hover:bg-[#0d4a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269]"
        >
          Back to Mentorships
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {mentorship.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {mentorship.description}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                mentorship.status
              )}`}
            >
              {mentorship.status.charAt(0).toUpperCase() +
                mentorship.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                {getCategoryIcon(mentorship.category)}
                <span className="ml-2">
                  {mentorship.category.charAt(0).toUpperCase() +
                    mentorship.category.slice(1)}
                </span>
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <ClockIcon className="h-5 w-5 text-[#136269] mr-2" />
                {mentorship.duration} months
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                {mentorship.location}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Mentor</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                {mentorship.mentor && mentorship.mentor.profilePicture ? (
                  <img
                    src={
                      mentorship.mentor.profilePicture.startsWith("http")
                        ? mentorship.mentor.profilePicture
                        : `http://localhost:5000${mentorship.mentor.profilePicture}`
                    }
                    alt={mentorship.mentor.name}
                    className="h-8 w-8 rounded-full object-cover mr-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "http://localhost:5000/uploads/profiles/default.png";
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#136269] flex items-center justify-center mr-2">
                    <span className="text-sm font-medium text-white">
                      {mentorship.mentor?.name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
                <span>{mentorship.mentor?.name || "Unknown User"}</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Add MentorshipChat component for active mentorships */}
        {mentorship.status === "active" && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Mentorship Chat
            </h4>
            <MentorshipChat mentorshipId={id} />
          </div>
        )}

        <div className="px-4 py-5 sm:px-6">
          {user && mentorship.mentor && mentorship.mentor._id === user._id ? (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => navigate(`/edit-mentorship/${id}`)}
                className="inline-flex items-center px-3 py-1.5 border border-[#136269] shadow-sm text-sm font-medium rounded-md text-[#136269] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269]"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          ) : user &&
            mentorship.status === "open" &&
            mentorship.mentor &&
            mentorship.mentor._id !== user._id ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="requestMessage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message to Mentor
                </label>
                <div className="mt-1">
                  <textarea
                    id="requestMessage"
                    name="requestMessage"
                    rows={3}
                    className="shadow-sm focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Tell the mentor why you're interested in this mentorship..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleRequest}
                  disabled={!requestMessage.trim()}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    requestMessage.trim()
                      ? "bg-[#136269] hover:bg-[#0d4a50]"
                      : "bg-gray-400 cursor-not-allowed"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269]`}
                >
                  Request Mentorship
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MentorshipDetail;
