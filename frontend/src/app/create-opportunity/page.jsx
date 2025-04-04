'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const CreateOpportunity = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    field: '',
    deadline: '',
    link: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          authorId: user._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create opportunity');
      }

      router.push('/opportunities');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#136269] mb-8">Post an Opportunity</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
          >
            <option value="">Select a category</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Workshop">Workshop</option>
            <option value="Event">Event</option>
            <option value="Internship">Internship</option>
            <option value="Job">Job</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
          >
            <option value="">Select a location</option>
            <option value="Mogadishu">Mogadishu</option>
            <option value="Hargeisa">Hargeisa</option>
            <option value="Kismayo">Kismayo</option>
            <option value="Bosaso">Bosaso</option>
            <option value="Baidoa">Baidoa</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <label htmlFor="field" className="block text-sm font-medium text-gray-700">
            Field
          </label>
          <select
            id="field"
            name="field"
            required
            value={formData.field}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
          >
            <option value="">Select a field</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Engineering">Engineering</option>
            <option value="Arts">Arts</option>
            <option value="Science">Science</option>
            <option value="Social Sciences">Social Sciences</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            required
            value={formData.deadline}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
          />
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Link (Optional)
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/opportunities')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#5DB2B3] text-white rounded-md text-sm font-medium hover:bg-[#479da0] disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOpportunity; 