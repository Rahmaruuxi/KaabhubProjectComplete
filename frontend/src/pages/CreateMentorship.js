import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const CreateMentorship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "programming",
    duration: "",
    requirements: [""],
    schedule: "",
    location: "",
    communityLink: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to create a mentorship");
      }

      if (formData.communityLink && !isValidUrl(formData.communityLink)) {
        setError("Please enter a valid URL starting with http:// or https://");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/mentorships",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/mentorship/${response.data._id}`);
    } catch (error) {
      console.error("Error creating mentorship:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create mentorship. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-100 bg-gradient-to-r from-[#136269] to-[#0d4a50] text-center">
            <h3 className="text-3xl font-bold text-white">
              Create Mentorship Opportunity
            </h3>
            <p className="mt-3 text-[#5DB2B3] text-lg">
              Share your expertise and help others grow in their career
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                    placeholder="e.g., Python Programming Mentor"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                  >
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                  placeholder="Describe what you can offer as a mentor..."
                />
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                    placeholder="e.g., 3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="schedule"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Schedule
                  </label>
                  <input
                    type="text"
                    name="schedule"
                    id="schedule"
                    required
                    value={formData.schedule}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                    placeholder="e.g., 2 hours per week"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requirements
                </label>
                <div className="space-y-3">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) =>
                          handleRequirementChange(index, e.target.value)
                        }
                        className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                        placeholder="e.g., Basic programming knowledge"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269] transition duration-150 ease-in-out"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Requirement
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                    placeholder="e.g., Remote"
                  />
                </div>

                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Application Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    id="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    When should applications close?
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="communityLink"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Community or Group Link
                </label>
                <input
                  type="url"
                  name="communityLink"
                  id="communityLink"
                  value={formData.communityLink}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-2 focus:ring-[#136269] focus:border-[#136269] block w-full sm:text-sm border-gray-300 rounded-lg transition duration-150 ease-in-out"
                  placeholder="e.g., https://discord.gg/... or https://chat.whatsapp.com/..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add your community link (Discord server, WhatsApp group, etc.)
                </p>
              </div>
            </div>

            <div className="mt-10 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/mentorships")}
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269] transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#136269] hover:bg-[#0d4a50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Mentorship"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMentorship;
