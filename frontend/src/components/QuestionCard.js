import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ChatBubbleLeftIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline';

const QuestionCard = ({ question }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          {question.author.profilePicture ? (
            <img
              src={question.author.profilePicture.startsWith('http') 
                ? question.author.profilePicture 
                : `http://localhost:5000${question.author.profilePicture}`}
              alt={question.author.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 hover:border-[#136269] transition-colors duration-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'http://localhost:5000/uploads/profiles/default.png';
              }}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-[#136269] flex items-center justify-center border-2 border-gray-200 hover:border-[#136269] transition-colors duration-200">
              <span className="text-sm font-medium text-white">
                {question.author?.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>
        <div>
          <Link to={`/profile/${question.author._id}`} className="text-sm font-medium text-gray-900 hover:text-[#136269] transition-colors duration-200">
            {question.author.name}
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(question.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Link to={`/questions/${question._id}`} className="block">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-[#136269] transition-colors duration-200">
          {question.title}
        </h2>
        <p className="text-gray-600 line-clamp-3">{question.content}</p>
      </Link>

      {question.tags && question.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
          {question.answers.length} answers
        </div>
        <div className="flex items-center">
          <EyeIcon className="h-4 w-4 mr-1" />
          {question.views} views
        </div>
      </div>
    </div>
  );
};

export default QuestionCard; 