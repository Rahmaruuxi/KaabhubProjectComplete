import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  UserCircleIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: `/question/${id}` } });
      return;
    }

    fetchQuestion();
  }, [id, token, navigate]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/questions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestion(response.data);
      setEditedQuestion({
        title: response.data.title,
        content: response.data.content,
        tags: response.data.tags.join(", "),
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch question");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/questions/${id}/answers`,
        { content: newAnswer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the question state with the new answer
      // The response.data contains the updated question with the new answer
      setQuestion(response.data);
      setNewAnswer("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer");
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/questions/${id}`,
        {
          ...editedQuestion,
          tags: editedQuestion.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestion(response.data);
      setShowEditForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update question");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/questions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#136269]"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-gray-500">Question not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : question ? (
        <div className="space-y-6">
          <button
            onClick={() => navigate("/questions")}
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#136269] mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Questions
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              {question.author?.profilePicture ? (
                <img
                  src={
                    question.author.profilePicture.startsWith("http")
                      ? question.author.profilePicture
                      : `http://localhost:5000${question.author.profilePicture}`
                  }
                  alt={question.author?.name || "User"}
                  className="h-10 w-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "http://localhost:5000/uploads/profiles/default.png";
                  }}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#136269] flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {question.author?.name?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <div>
                <Link
                  to={`/profile/${question.author?._id}`}
                  className="text-sm font-medium text-gray-900 hover:text-[#136269]"
                >
                  {question.author?.name || "Unknown User"}
                </Link>
                <p className="text-xs text-gray-500">
                  {new Date(question.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {question.title}
            </h1>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">
              {question.content}
            </p>

            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#136269]/10 text-[#136269]"
                  >
                    <TagIcon className="h-3 w-3 mr-0.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  {question.answers.length} answers
                </div>
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {question.views} views
                </div>
              </div>

              {user && question.author && user._id === question.author._id && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="p-1 text-gray-600 hover:text-[#136269] transition-colors duration-200"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDeleteQuestion}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {showEditForm && (
            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 mb-6">
              <form onSubmit={handleUpdateQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedQuestion.title}
                    onChange={(e) =>
                      setEditedQuestion({
                        ...editedQuestion,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5DB2B3] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={editedQuestion.content}
                    onChange={(e) =>
                      setEditedQuestion({
                        ...editedQuestion,
                        content: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5DB2B3] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editedQuestion.tags}
                    onChange={(e) =>
                      setEditedQuestion({
                        ...editedQuestion,
                        tags: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5DB2B3] focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#136269] text-white rounded-lg hover:bg-[#0f4a52]"
                  >
                    Update Question
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Answers</h2>

            {user && (
              <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Answer
                    </label>
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5DB2B3] focus:border-transparent"
                      required
                      placeholder="Write your answer here..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#136269] text-white rounded-lg hover:bg-[#0f4a52]"
                    >
                      Post Answer
                    </button>
                  </div>
                </form>
              </div>
            )}

            {question.answers.map((answer) => (
              <div
                key={answer._id}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                        <div className="flex items-center">
                          {answer.author?.profilePicture ? (
                            <img
                              src={
                                answer.author.profilePicture.startsWith("http")
                                  ? answer.author.profilePicture
                                  : `http://localhost:5000${answer.author.profilePicture}`
                              }
                              alt={answer.author?.name || "User"}
                              className="h-6 w-6 rounded-full mr-1.5 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "http://localhost:5000/uploads/profiles/default.png";
                              }}
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-[#136269] flex items-center justify-center mr-1.5">
                              <span className="text-xs font-medium text-white">
                                {answer.author?.name?.charAt(0) || "?"}
                              </span>
                            </div>
                          )}
                          <span>{answer.author?.name || "Unknown User"}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-0.5" />
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-gray-600">{answer.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default QuestionDetail;
