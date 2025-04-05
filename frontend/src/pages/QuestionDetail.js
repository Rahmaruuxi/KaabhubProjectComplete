import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import io from "socket.io-client";
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
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: `/question/${id}` } });
      return;
    }

    fetchQuestion();
    
    // Set up socket connection
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    socketRef.current = io(apiUrl);
    
    // Join question room
    socketRef.current.emit("join-question", id);
    console.log(`Joined question room: ${id}`);
    
    // Listen for question updates
    socketRef.current.on("question-updated", (updatedQuestion) => {
      console.log("Question updated:", updatedQuestion);
      if (updatedQuestion._id === id) {
        setQuestion(updatedQuestion);
      }
    });
    
    // Listen for new answers
    socketRef.current.on("new-answer", (answer) => {
      console.log("New answer received:", answer);
      if (answer.question === id) {
        setQuestion((prev) => ({
          ...prev,
          answers: [...prev.answers, answer],
        }));
      }
    });
    
    // Listen for answer updates
    socketRef.current.on("answer-updated", (updatedAnswer) => {
      console.log("Answer updated:", updatedAnswer);
      if (updatedAnswer.question === id) {
        setQuestion((prev) => ({
          ...prev,
          answers: prev.answers.map((a) => 
            a._id === updatedAnswer._id ? updatedAnswer : a
          ),
        }));
      }
    });
    
    // Listen for answer deletions
    socketRef.current.on("answer-deleted", (answerId) => {
      console.log("Answer deleted:", answerId);
      setQuestion((prev) => ({
        ...prev,
        answers: prev.answers.filter((a) => a._id !== answerId),
      }));
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-question", id);
        socketRef.current.disconnect();
      }
    };
  }, [id, token, navigate]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.get(
        `${apiUrl}/api/questions/${id}`,
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
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.post(
        `${apiUrl}/api/answers`,
        { content: newAnswer, questionId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // The socket event will handle updating the question state
      setNewAnswer("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer");
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await axios.put(
        `${apiUrl}/api/questions/${id}`,
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
      // The socket event will handle updating the question state
      setShowEditForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update question");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/questions/${id}`, {
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
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{question.views || 0} views</span>
                </div>
                <div className="flex items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  <span>{question.answers?.length || 0} answers</span>
                </div>
              </div>

              {user && user._id === question.author?._id && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowEditForm(!showEditForm)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteQuestion}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {showEditForm && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Edit Question
              </h2>
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {question.answers?.length || 0} Answers
            </h2>

            {user ? (
              <form onSubmit={handleSubmitAnswer} className="mb-6">
                <div className="mb-4">
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5DB2B3] focus:border-transparent"
                    placeholder="Write your answer here..."
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#136269] text-white rounded-lg hover:bg-[#0f4a52]"
                  >
                    Post Answer
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Please log in to post an answer.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {question.answers && question.answers.length > 0 ? (
              <div className="space-y-6">
                {question.answers.map((answer) => (
                  <div
                    key={answer._id}
                    className={`border rounded-lg p-4 ${
                      answer.isAccepted
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {answer.author?.profilePicture ? (
                        <img
                          src={
                            answer.author.profilePicture.startsWith("http")
                              ? answer.author.profilePicture
                              : `http://localhost:5000${answer.author.profilePicture}`
                          }
                          alt={answer.author?.name || "User"}
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
                            {answer.author?.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <div>
                        <Link
                          to={`/profile/${answer.author?._id}`}
                          className="text-sm font-medium text-gray-900 hover:text-[#136269]"
                        >
                          {answer.author?.name || "Unknown User"}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap mb-4">
                      {answer.content}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                          <span>{answer.comments?.length || 0} comments</span>
                        </div>
                      </div>

                      {user && user._id === question.author?._id && !question.isSolved && (
                        <button
                          onClick={async () => {
                            try {
                              const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
                              await axios.post(
                                `${apiUrl}/api/answers/${answer._id}/accept`,
                                {},
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              // The socket event will handle updating the question state
                            } catch (err) {
                              setError(
                                err.response?.data?.message ||
                                  "Failed to accept answer"
                              );
                            }
                          }}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                            answer.isAccepted
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {answer.isAccepted ? "Accepted" : "Accept Answer"}
                        </button>
                      )}

                      {answer.isAccepted && (
                        <div className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Accepted Answer
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No answers yet. Be the first to answer!</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default QuestionDetail;
