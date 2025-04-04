import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  PlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  UserCircleIcon,
  PhotoIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Posts = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/posts" } });
      return;
    }

    fetchPosts();
  }, [token, navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      navigate("/login", { state: { from: "/posts" } });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: response.data.likes || [],
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error("Like error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to like post. Please try again.";
      setError(errorMessage);

      await fetchPosts();
    }
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-[#136269]">Posts</h1>
          {user && (
            <button
              onClick={() => navigate("/create-post")}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#136269] hover:bg-[#0f4a52]"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Create Post
            </button>
          )}
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-[#5DB2B3] hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {post.title}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        {post.author && post.author.profilePicture ? (
                          <img
                            src={
                              post.author.profilePicture.startsWith("http")
                                ? post.author.profilePicture
                                : `http://localhost:5000${post.author.profilePicture}`
                            }
                            alt={post.author.name}
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
                              {post.author?.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                        <span className="ml-2 text-sm text-gray-500">
                          {post.author?.name || "Unknown User"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-0.5" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {post.images && post.images.length > 0 && (
                      <div className="mb-2">
                        <img
                          src={`http://localhost:5000${post.images[0]}`}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center space-x-1 group transition-all duration-200 ${
                          post.likes.includes(user?._id)
                            ? "text-red-500"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <HeartIcon className="h-4 w-4 transform group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">{post.likes.length}</span>
                      </button>
                      <div className="flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-0.5" />
                        {post.comments.length}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-0.5" />
                        {post.views}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="ml-3 px-3 py-1 text-xs font-medium text-white bg-[#136269] rounded-lg hover:bg-[#0f4a52]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
