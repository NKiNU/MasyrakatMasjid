// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
// import MainLayout from '../../components/MainLayout';
// import SidebarNavigation from '../../components/SideBar/SideNavBar';
// import { classService } from '../../api/classApi';

// const ClassList = () => {

//     const [classes, setClasses] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchClasses = async () => {
//           try {
//             const data = await classService.getClasses();
//             setClasses(data.classes); // Update with fetched classes
//           } catch (err) {
//             setError(err.message || 'Failed to fetch classes');
//           } finally {
//             setLoading(false);
//           }
//         };
    
//         fetchClasses();
//       }, []);

      
//   // Example data - replace with your actual data fetching
// //   const classes = [
// //     {
// //       id: 1,
// //       className: "Introduction to Islamic Studies",
// //       description: "Learn the fundamentals of Islamic studies in this comprehensive course.",
// //       startDate: "2024-02-01",
// //       startTime: "10:00",
// //       venue: "physical",
// //       venueDetails: "Main Hall, Islamic Center",
// //       isPaid: true,
// //       price: 50,
// //       image: "/api/placeholder/400/300",
// //       participants: new Array(15),
// //       capacity: 30
// //     },
// //     // Add more class examples
// //   ];

// if (loading) {
//     return <div>Loading classes...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!classes || classes.length === 0) {
//     return <div>Loading classes...</div>;
//   }

//   return (
//     <>
//       <SidebarNavigation />
//       <MainLayout>
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-gray-900">Available Classes</h1>
//             <p className="mt-2 text-gray-600">Explore our range of Islamic education classes</p>
//           </div>

//           {/* Filters */}
//           <div className="mb-6 flex flex-wrap gap-4">
//             <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option value="">All Venues</option>
//               <option value="physical">Physical</option>
//               <option value="online">Online</option>
//             </select>
//             <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option value="">All Types</option>
//               <option value="free">Free</option>
//               <option value="paid">Paid</option>
//             </select>
//           </div>

//           {/* Class Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {classes.map((classItem) => (
//               <Link 
//                 key={classItem._id}
//                 to={`/classes/${classItem._id}`}
//                 className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
//               >
//                 {/* Class Image */}
//                 <div className="relative h-48">
//                   <img 
//                     src={classItem.images[0] || '/placeholder-image.jpg'}
//                     alt={classItem.className}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   {classItem.isPaid && (
//                     <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//                       ${classItem.price}
//                     </div>
//                   )}
//                 </div>

//                 {/* Class Info */}
//                 <div className="p-5">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     {classItem.className}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {classItem.description}
//                   </p>

//                   {/* Class Details */}
//                   <div className="space-y-2">
//                     <div className="flex items-center text-sm text-gray-500">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       <span>{new Date(classItem.startDate).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <Clock className="w-4 h-4 mr-2" />
//                       <span>{classItem.startTime}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <MapPin className="w-4 h-4 mr-2" />
//                       <span>{classItem.venue === 'online' ? 'Online Class' : classItem.venueDetails}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <Users className="w-4 h-4 mr-2" />
//                       <span>{classItem.participants.length} / {classItem.capacity} enrolled</span>
//                     </div>
//                   </div>

//                   {/* Progress Bar */}
//                   <div className="mt-4">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-600 h-2 rounded-full"
//                         style={{ width: `${(classItem.participants.length / classItem.capacity) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </MainLayout>
//     </>
//   );
// };

// export default ClassList;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import MainLayout from '../../components/MainLayout';
import SidebarNavigation from '../../components/SideBar/SideNavBar';
import { classService } from '../../api/classApi';

const ClassList = () => {

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
          try {
            const data = await classService.getClasses();
            setClasses(data.classes); // Update with fetched classes
          } catch (err) {
            setError(err.message || 'Failed to fetch classes');
          } finally {
            setLoading(false);
          }
        };
    
        fetchClasses();
      }, []);

      
  // Example data - replace with your actual data fetching
//   const classes = [
//     {
//       id: 1,
//       className: "Introduction to Islamic Studies",
//       description: "Learn the fundamentals of Islamic studies in this comprehensive course.",
//       startDate: "2024-02-01",
//       startTime: "10:00",
//       venue: "physical",
//       venueDetails: "Main Hall, Islamic Center",
//       isPaid: true,
//       price: 50,
//       image: "/api/placeholder/400/300",
//       participants: new Array(15),
//       capacity: 30
//     },
//     // Add more class examples
//   ];

if (loading) {
    return <div>Loading classes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!classes || classes.length === 0) {
    return <div>Loading classes...</div>;
  }

  return (
    <>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Available Classes</h1>
            <p className="mt-2 text-gray-600">Explore our range of Islamic education classes</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Venues</option>
              <option value="physical">Physical</option>
              <option value="online">Online</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Class Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Link 
                key={classItem._id}
                to={`/kuliyyah/classes/${classItem._id}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Class Image */}
                <div className="relative h-48">
                  <img 
                    src={classItem.images[0] || '/placeholder-image.jpg'}
                    alt={classItem.className}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {classItem.isPaid && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ${classItem.price}
                    </div>
                  )}
                </div>

                {/* Class Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {classItem.className}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {classItem.description}
                  </p>

                  {/* Class Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(classItem.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{classItem.startTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{classItem.venue === 'online' ? 'Online Class' : classItem.venueDetails}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{classItem.participants.length} / {classItem.capacity} enrolled</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(classItem.participants.length / classItem.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      
    </>
  );
};

export default ClassList;