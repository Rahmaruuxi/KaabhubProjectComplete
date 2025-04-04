import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon } from '@heroicons/react/24/outline';

const Opportunities = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    field: searchParams.get('field') || ''
  });

  useEffect(() => {
    fetchOpportunities();
  }, [filters]);

  const fetchOpportunities = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.field) queryParams.append('field', filters.field);

      const response = await fetch(`/api/opportunities?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Update URL with new filters
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`/opportunities?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5DB2B3]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#136269]">Opportunities</h1>
        {user && (
          <button
            onClick={() => router.push('/create-opportunity')}
            className="flex items-center px-4 py-2 bg-[#5DB2B3] text-white rounded-md hover:bg-[#479da0] transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post an Opportunity
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
        >
          <option value="">All Categories</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Workshop">Workshop</option>
          <option value="Event">Event</option>
          <option value="Internship">Internship</option>
          <option value="Job">Job</option>
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
        >
          <option value="">All Locations</option>
          <option value="Mogadishu">Mogadishu</option>
          <option value="Hargeisa">Hargeisa</option>
          <option value="Kismayo">Kismayo</option>
          <option value="Bosaso">Bosaso</option>
          <option value="Baidoa">Baidoa</option>
          <option value="Remote">Remote</option>
        </select>

        <select
          name="field"
          value={filters.field}
          onChange={handleFilterChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-[#5DB2B3] focus:ring-[#5DB2B3]"
        >
          <option value="">All Fields</option>
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

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={opportunity.author.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(opportunity.author.name)}`}
                  alt={opportunity.author.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{opportunity.author.name}</h3>
                  <p className="text-sm text-gray-500">{new Date(opportunity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-[#136269] mb-2">{opportunity.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-[#5DB2B3]/10 text-[#5DB2B3] rounded-full text-sm">
                  {opportunity.category}
                </span>
                <span className="px-2 py-1 bg-[#5DB2B3]/10 text-[#5DB2B3] rounded-full text-sm">
                  {opportunity.location}
                </span>
                <span className="px-2 py-1 bg-[#5DB2B3]/10 text-[#5DB2B3] rounded-full text-sm">
                  {opportunity.field}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                </p>
                {opportunity.link && (
                  <a
                    href={opportunity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5DB2B3] hover:text-[#479da0] text-sm font-medium"
                  >
                    Learn More →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No opportunities found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Opportunities; 