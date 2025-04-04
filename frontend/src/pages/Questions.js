import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  PlusIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  UserCircleIcon,
  CalendarIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Questions = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    fetchQuestions();
  }, [token]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching questions..."); // Debug log
      const response = await axios.get("http://localhost:5000/api/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Questions received:", response.data); // Debug log
      setQuestions(response.data);
    } catch (err) {
      console.error("Error fetching questions:", err); // Debug log
      setError(
        err.response?.data?.message ||
          "Failed to fetch questions. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/questions",
        {
          ...newQuestion,
          tags: newQuestion.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions([response.data, ...questions]);
      setShowCreateForm(false);
      setNewQuestion({ title: "", content: "", tags: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create question");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#136269] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Error Loading Questions
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchQuestions}
              className="px-4 py-2 bg-[#136269] text-white rounded-lg hover:bg-[#0f4a52]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#136269]">Questions</h1>
          {user && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#136269] hover:bg-[#0f4a52] transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Ask Question
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {showCreateForm && (
          <div className="mb-6 bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5DB2B3] focus:border-transparent"
                  required
                  placeholder="What's your question?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, content: e.target.value })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5DB2B3] focus:border-transparent"
                  required
                  placeholder="Describe your question in detail..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newQuestion.tags}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, tags: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5DB2B3] focus:border-transparent"
                  placeholder="e.g., javascript, react, nodejs"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#136269] text-white rounded-lg hover:bg-[#0f4a52]"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">No questions found</p>
            </div>
          ) : (
            questions.map((question) => (
              <div
                key={question._id}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {question.title}
                        </h2>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                        <div className="flex items-center">
                          {question.author && question.author.profilePicture ? (
                            <img
                              src={
                                question.author.profilePicture.startsWith(
                                  "http"
                                )
                                  ? question.author.profilePicture
                                  : `http://localhost:5000${question.author.profilePicture}`
                              }
                              alt={question.author.name}
                              className="h-8 w-8 rounded-full object-cover mr-1.5"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "http://localhost:5000/uploads/profiles/default.png";
                              }}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-[#136269] flex items-center justify-center mr-1.5">
                              <span className="text-sm font-medium text-white">
                                {question.author?.name?.charAt(0) || "?"}
                              </span>
                            </div>
                          )}
                          <span>{question.author?.name || "Unknown User"}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-0.5" />
                          {new Date(question.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {question.content}
                      </p>

                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {question.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#136269]/10 text-[#136269]"
                            >
                              <TagIcon className="h-3 w-3 mr-0.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-0.5" />
                          {question.answers?.length || 0} answers
                        </div>
                        <div className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-0.5" />
                          {question.views || 0} views
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {user &&
                        question.author &&
                        user._id === question.author._id && (
                          <>
                            <button
                              onClick={() =>
                                navigate(`/question/${question._id}/edit`)
                              }
                              className="p-1 text-gray-600 hover:text-[#136269] transition-colors duration-200"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question._id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      <button
                        onClick={() => navigate(`/question/${question._id}`)}
                        className="px-3 py-1 text-xs font-medium text-white bg-[#136269] rounded-lg hover:bg-[#0f4a52]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;
