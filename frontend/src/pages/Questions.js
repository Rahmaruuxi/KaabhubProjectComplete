import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import io from "socket.io-client";
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
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editContent, setEditContent] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/questions" } });
      return;
    }

    fetchQuestions();

    // Set up socket connection
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    socketRef.current = io(apiUrl);

    // Join questions room
    socketRef.current.emit("join-questions");

    // Listen for new questions
    socketRef.current.on("new-question", (question) => {
      setQuestions((prev) => [question, ...prev]);
    });

    // Listen for updated questions
    socketRef.current.on("question-updated", (updatedQuestion) => {
      setQuestions((prev) =>
        prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q))
      );
    });

    // Listen for deleted questions
    socketRef.current.on("question-deleted", (questionId) => {
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-questions");
        socketRef.current.disconnect();
      }
    };
  }, [token, navigate]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.get(`${apiUrl}/api/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch questions. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (questionId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await axios.put(
        `${apiUrl}/api/questions/${questionId}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId
            ? {
                ...q,
                content: editContent,
              }
            : q
        )
      );
      setEditingQuestion(null);
      setEditContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit question");
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q._id !== questionId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete question");
    }
  };

  const startEditing = (question) => {
    setEditingQuestion(question._id);
    setEditContent(question.content);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#136269]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-[#136269]">Questions</h1>
          {user && (
            <button
              onClick={() => navigate("/ask-question")}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#136269] hover:bg-[#0f4a52]"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Ask Question
            </button>
          )}
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-[#5DB2B3] hover:shadow-lg transition-shadow duration-200 p-4"
            >
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
                            question.author.profilePicture.startsWith("http")
                              ? question.author.profilePicture
                              : `http://localhost:5000${question.author.profilePicture}`
                          }
                          alt={question.author.name}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "http://localhost:5000/uploads/profiles/default.png";
                          }}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-[#136269] flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {question.author?.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <span className="ml-2 text-sm text-gray-500">
                        {question.author?.name || "Unknown User"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-0.5" />
                      {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {editingQuestion === question._id ? (
                    <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136269] focus:border-transparent transition-all duration-200 text-sm"
                        rows="4"
                        placeholder="Edit your question..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingQuestion(null)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269] transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEdit(question._id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#136269] rounded-lg hover:bg-[#0f4a52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269] transition-all duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {question.content}
                    </p>
                  )}

                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#136269]/5 text-[#136269] rounded-full"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
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

                    {user &&
                      question.author &&
                      (() => {
                        // Safely get user ID
                        const userId = user._id || user.id;
                        // Safely get author ID
                        const authorId = question.author._id || question.author;

                        // Add console logs for debugging
                        console.log("User ID:", userId);
                        console.log("Author ID:", authorId);

                        // Only render if we have valid IDs to compare
                        return (
                          userId &&
                          authorId &&
                          userId.toString() === authorId.toString() && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => startEditing(question)}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-[#136269] bg-[#136269]/10 rounded-md hover:bg-[#136269]/20 transition-all duration-200"
                              >
                                <PencilIcon className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(question._id)}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-all duration-200"
                              >
                                <TrashIcon className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </button>
                            </div>
                          )
                        );
                      })()}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/question/${question._id}`)}
                  className="ml-3 px-3 py-1 text-xs font-medium text-white bg-[#136269] rounded-lg hover:bg-[#0f4a52]"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
