import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinedClasses = ({ userId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJoinedClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/api/classes/my/joined`, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setClasses(response.data.classes);
        console.log(response.data.classes)
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch joined classes');
        setLoading(false);
      }
    };

    fetchJoinedClasses();
  }, [userId]);

  const handleLeaveClass = async (classId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/api/classes/${classId}/leave`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove the class from the list
      setClasses(classes.filter(c => c._id !== classId));
    } catch (error) {
      setError('Failed to leave class');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Joined Classes</h2>
      {classes.length === 0 ? (
        <p className="text-gray-500">No classes joined yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{classItem.className}</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  classItem.venue === 'online' ? 
                  'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {classItem.venue}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">{classItem.description}</p>
              
              <div className="space-y-1 mb-4">
                <p className="text-sm">
                  <span className="font-medium">Venue Details:</span> {classItem.venueDetails}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {new Date(classItem.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time:</span> {classItem.startTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Participants:</span> {classItem.participants.length}/{classItem.capacity}
                </p>
                {classItem.isPaid && (
                  <p className="text-sm">
                    <span className="font-medium">Price:</span> ${classItem.price}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => navigate(`/kuliyyah/classes/${classItem._id}`)}
                  className="px-3 py-1 text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleLeaveClass(classItem._id)}
                  className="px-3 py-1 text-red-600 hover:text-red-800"
                >
                  Leave Class
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinedClasses;