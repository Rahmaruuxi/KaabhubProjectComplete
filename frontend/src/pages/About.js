import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  LightBulbIcon,
  HeartIcon,
  SparklesIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#136269] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Somali Students Through Knowledge
            </h1>
            <p className="text-xl md:text-2xl text-[#5DB2B3] max-w-3xl mx-auto">
              KAAB HUB connects students with mentors, scholarships, and learning opportunities to create a brighter future for all.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-1 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              KAAB HUB was born from a simple idea: **every student deserves a strong support system.** In Somalia, where students often lack access to reliable mentorship, guidance, and educational resources, we saw a chance to create something impactful.
            </p>
            <p className="text-lg text-gray-600">
              What started as a dream to connect curious learners with skilled locals has grown into a vibrant platform. Here, students ask real questions, mentors offer real support, and opportunity becomes a shared resource. We're not just a website — we're a movement.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <HeartIcon className="h-12 w-12 text-[#136269] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">
                We believe in the power of community and mutual support to help students succeed.
              </p>
            </div>
            <div className="text-center p-6">
              <SparklesIcon className="h-12 w-12 text-[#136269] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Empowerment</h3>
              <p className="text-gray-600">
                We empower students with knowledge, resources, and connections to achieve their goals.
              </p>
            </div>
            <div className="text-center p-6">
              <ArrowPathIcon className="h-12 w-12 text-[#136269] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Educational Equity</h3>
              <p className="text-gray-600">
                We're committed to breaking down barriers and creating equal opportunities for all students.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <QuestionMarkCircleIcon className="h-12 w-12 text-[#136269] mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Questions & Answers</h3>
            <p className="text-gray-600">
              Connect with peers and mentors to get help with academic challenges and career guidance.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <UserIcon className="h-12 w-12 text-[#136269] mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mentorship</h3>
            <p className="text-gray-600">
              Find experienced mentors who can guide you through your educational and professional journey.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <AcademicCapIcon className="h-12 w-12 text-[#136269] mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Opportunity Sharing</h3>
            <p className="text-gray-600">
              Discover scholarships, internships, and other opportunities to advance your education and career.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#136269] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community Today</h2>
          <p className="text-xl text-[#5DB2B3] mb-8 max-w-2xl mx-auto">
            Be part of a growing community of students and mentors dedicated to educational excellence.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-[#136269] px-8 py-3 rounded-md font-semibold hover:bg-[#5DB2B3] hover:text-white transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
