import React, { useState } from 'react';

// Sample opportunity data
const sampleOpportunities = [
  {
    id: 1,
    title: "Full Scholarship at SIMAD University",
    host: "SIMAD University",
    deadline: "2024-05-15",
    location: "Mogadishu",
    category: "Scholarship",
    field: "Computer Science",
    description: "Full undergraduate scholarship covering tuition and accommodation for high-achieving students passionate about technology and innovation.",
  },
  {
    id: 2,
    title: "Web Development Workshop",
    host: "Tech Hub Somalia",
    deadline: "2024-04-20",
    location: "Hargeisa",
    category: "Workshop",
    field: "IT",
    description: "Hands-on workshop covering modern web development technologies. Perfect for beginners looking to start their coding journey.",
  },
  {
    id: 3,
    title: "Business Leadership Summit",
    host: "Somalia Chamber of Commerce",
    deadline: "2024-06-01",
    location: "Mogadishu",
    category: "Event",
    field: "Business",
    description: "Annual summit bringing together business leaders to discuss innovation and growth in Somalia's economy.",
  },
  {
    id: 4,
    title: "Engineering Internship Program",
    host: "Somali Power Solutions",
    deadline: "2024-05-30",
    location: "Bosaso",
    category: "Internship",
    field: "Engineering",
    description: "6-month paid internship program for engineering students interested in renewable energy solutions.",
  }
];

const OpportunitiesPage = () => {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    field: '',
  });

  // Apply the filters before rendering
  const filteredOpportunities = sampleOpportunities.filter((opportunity) => {
    const matchCategory = !filters.category || opportunity.category === filters.category;
    const matchLocation = !filters.location || opportunity.location === filters.location;
    const matchField = !filters.field || opportunity.field === filters.field;
    return matchCategory && matchLocation && matchField;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-[#136269] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Grow Through Opportunity
          </h1>
          <p className="text-xl text-gray-100">
            Find scholarships, training, and local events shared by your community.
          </p>
        </div>
      </header>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3]"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Workshop">Workshop</option>
            <option value="Event">Event</option>
            <option value="Internship">Internship</option>
            <option value="Job">Job</option>
          </select>

          <select
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3]"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">All Locations</option>
            <option value="Mogadishu">Mogadishu</option>
            <option value="Hargeisa">Hargeisa</option>
            <option value="Bosaso">Bosaso</option>
            <option value="Kismayo">Kismayo</option>
            <option value="Baidoa">Baidoa</option>
          </select>

          <select
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3]"
            value={filters.field}
            onChange={(e) => setFilters({ ...filters, field: e.target.value })}
          >
            <option value="">All Fields</option>
            <option value="IT">IT</option>
            <option value="Business">Business</option>
            <option value="Engineering">Engineering</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Health">Health</option>
            <option value="Arts">Arts</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredOpportunities.length === 0 ? (
          <p className="text-center text-gray-500">No opportunities match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#5DB2B3] text-white text-sm rounded-full">
                      {opportunity.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#136269] mb-2">
                    {opportunity.title}
                  </h3>
                  <p className="text-gray-600 mb-2">🏫 {opportunity.host}</p>
                  <p className="text-gray-600 mb-2">🌍 {opportunity.location}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">{opportunity.description}</p>
                  <button className="w-full bg-[#136269] text-white py-2 px-4 rounded-md hover:bg-[#5DB2B3] transition-colors duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-[#136269] text-white py-16 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Are you a mentor, school, or local leader?
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Share something valuable with our community.
          </p>
          <button className="bg-white text-[#136269] py-3 px-8 rounded-md text-lg font-semibold hover:bg-[#5DB2B3] hover:text-white transition-colors duration-300">
            Post an Opportunity
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
