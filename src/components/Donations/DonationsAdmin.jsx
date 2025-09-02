// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   PointElement,
// } from "chart.js";
// import SidebarNavigation from "../SideBar/SideNavBar";
// import AddDonationModal from "./AddnewDonationModal";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
// import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day view
// import { FiCalendar } from "react-icons/fi";
// import EditDonationModal from "./EditDonationModal";
// import ViewDonationModal from "./ViewDonationModal";
// import { Button } from "@mui/material";
// import { Calendar, ChevronDown, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { Card, CardContent, CardHeader } from '@mui/material/';
// import { Dropdown } from '@mui/base/Dropdown';
// import { MenuButton } from '@mui/base/MenuButton';
// import { Menu } from '@mui/base/Menu';
// import { MenuItem } from '@mui/base/MenuItem';

// ChartJS.register(
//   BarElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const AdminDashboard = () => {
//   const [donations, setDonations] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDonation, setSelectedDonation] = useState("overall"); // Track selected donation
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [isEventModalOpen, setIsEventModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [donationLog, setDonationLog] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3001/api/donations")
//       .then((response) => setDonations(response.data))
//       .catch((error) => console.error(error));
//   }, []);

//   const handleAddDonation = (newDonation) => {
//     setDonations([...donations, newDonation]);
//   };

//   const handleDelete = (id) => {
//     axios
//       .delete(`http://localhost:3001/api/donations/${id}`)
//       .then(() =>
//         setDonations(donations.filter((donation) => donation._id !== id))
//       )
//       .catch((error) => console.error(error));
//   };

//   // Calculate metrics
//   const totalCampaigns = donations.length;
//   const totalCollected = donations.reduce(
//     (sum, donation) => sum + donation.currentAmount,
//     0
//   );
//   const overallTargeted = donations.reduce(
//     (sum, donation) => sum + donation.targetAmount,
//     0
//   );

//   // Prepare data for the bar chart
//   const donationTitles = donations.map((donation) => donation.title);
//   const collectedAmounts = donations.map((donation) => donation.currentAmount);
//   const targetAmounts = donations.map((donation) => donation.targetAmount);

//   const barChartData = {
//     labels: donationTitles,
//     datasets: [
//       {
//         label: "Collected Amount",
//         data: collectedAmounts,
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//       {
//         label: "Target Amount",
//         data: targetAmounts,
//         backgroundColor: "rgba(255, 99, 132, 0.6)",
//         borderColor: "rgba(255, 99, 132, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const barChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Donation Progress (Bar Chart)",
//       },
//     },
//   };

//   // Prepare data for the line graph based on selected type
//   const filteredDonations =
//     selectedDonation === "overall"
//       ? donations
//       : donations.filter((donation) => donation.title === selectedDonation);

//   // const lineChartLabels = filteredDonations.map(
//   //   (donation) => donation.startDate
//   // ); // Assuming startDate exists

// //   const lineChartLabels = filteredDonations.flatMap((donation) =>
// //   donation.donations.map((donationDetail) => {
// //     const date = new Date(donationDetail.date); // Ensure it's a Date object
// //     return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
// //   })
// // );
// //   // const lineChartDataPoints = filteredDonations.map(
// //   //   (donation) => donation.currentAmount
// //   // );
// //   const lineChartDataPoints = filteredDonations.flatMap((donation) =>
// //   donation.donations.map((donationDetail) => donationDetail.amount)
// // );

// // const donationByDate = {};

// // filteredDonations.forEach((donation) => {
// //   donation.donations.forEach((donationDetail) => {
// //     const date = new Date(donationDetail.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
// //     const amount = donationDetail.amount;

// //     // Accumulate donations for each date
// //     if (donationByDate[date]) {
// //       donationByDate[date] += amount;
// //     } else {
// //       donationByDate[date] = amount;
// //     }
// //   });
// // });

// // // Step 2: Convert the grouped data into sorted arrays
// // const sortedDates = Object.keys(donationByDate).sort(); // Get dates and sort them
// // const cumulativeAmounts = [];
// // let cumulativeSum = 0;

// // // Step 3: Calculate cumulative donation amount
// // sortedDates.forEach((date) => {
// //   cumulativeSum += donationByDate[date];
// //   cumulativeAmounts.push(cumulativeSum); // Store cumulative sum for each date
// // });

// // // Step 4: Prepare data for the chart
// // const lineChartData = {
// //   labels: sortedDates, // Dates as the labels (sorted)
// //   datasets: [
// //     {
// //       label:
// //         selectedDonation === "overall"
// //           ? "Overall Collected Donations"
// //           : `Collected Amount for ${selectedDonation}`,
// //       data: cumulativeAmounts, // Cumulative donation amounts
// //       fill: false,
// //       borderColor: "rgba(75, 192, 192, 1)",
// //       backgroundColor: "rgba(75, 192, 192, 0.2)",
// //       tension: 0.4,
// //     },
// //   ],
// // };

// // Step 1: Group donations by date
// const donationByDate = {};

// const closeViewModal = () => {
//   setSelectedDonation(null);
//   setDonationLog([]);
//   setIsViewModalOpen(false);
// };

// const handleViewDonation = (donationId) => {
//   axios
//     .get(`http://localhost:3001/api/donations/${donationId}`)
//     .then((response) => {
//       const { data } = response;
//       setSelectedDonation(data); // Contains title, description, targetAmount, currentAmount, and donations
//       setDonationLog(data.donations); // The `donations` array
//       setIsViewModalOpen(true);
//     })
//     .catch((error) => console.error(error));
// };

// filteredDonations.forEach((donation) => {
//   donation.donations.forEach((donationDetail) => {
//     const date = new Date(donationDetail.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
//     const amount = donationDetail.amount;

//     // Sum donations for each date
//     if (donationByDate[date]) {
//       donationByDate[date] += amount;
//     } else {
//       donationByDate[date] = amount;
//     }
//   });
// });

// // Step 2: Convert the grouped data into sorted arrays
// const sortedDates = Object.keys(donationByDate).sort(); // Get dates and sort them
// const dailyAmounts = sortedDates.map(date => donationByDate[date]); // Donations for each day

// // Step 3: Prepare data for the chart
// const lineChartData = {
//   labels: sortedDates, // Dates as the labels (sorted)
//   datasets: [
//     {
//       label:
//         selectedDonation === "overall"
//           ? "Donations Per Day"
//           : `Daily Donations for ${selectedDonation}`,
//       data: dailyAmounts, // Total donations per day
//       fill: false,
//       borderColor: "rgba(75, 192, 192, 1)",
//       backgroundColor: "rgba(75, 192, 192, 0.2)",
//       tension: 0.4,
//     },
//   ],
// };


//   // const lineChartData = {
//   //   labels: lineChartLabels,
//   //   datasets: [
//   //     {
//   //       label:
//   //         selectedDonation === "overall"
//   //           ? "Overall Collected Donations"
//   //           : `Collected Amount for ${selectedDonation}`,
//   //       data: lineChartDataPoints,
//   //       fill: false,
//   //       borderColor: "rgba(75, 192, 192, 1)",
//   //       backgroundColor: "rgba(75, 192, 192, 0.2)",
//   //       tension: 0.4,
//   //     },
//   //   ],
//   // };

//   const lineChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: `Donation Progress Over Time (Line Chart) - ${
//           selectedDonation === "overall" ? "Overall" : selectedDonation
//         }`,
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Date",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Amount Collected ($)",
//         },
//       },
//     },
//   };

//   // Prepare events for FullCalendar
//   const events = donations.map((donation) => ({
//     id: donation._id,
//     title: donation.title,
//     description: donation.description,
//     start: donation.startDate, // Ensure startDate is in ISO format
//     end: donation.endDate, // Ensure endDate is in ISO format
//     color: "#1B263B", // Customize color for events
//   }));

//   // Event click handler
//   const handleEventClick = (info) => {
//     const eventDetails = donations.find(
//       (donation) => donation._id === info.event.id
//     );
//     setSelectedEvent(eventDetails); // Set the selected event
//   };

//   const closeEventModal = () => {
//     setSelectedEvent(null); // Clear the selected event
//   };

//   const editDonation = (donation) => {
//     setSelectedEvent(donation); // Set the selected donation for editing
//     setIsEditModalOpen(true); // Open the edit modal
//   };

//   const handleSaveEdit = (id, updatedData) => {
//     axios
//       .put(`http://localhost:3001/api/donations/${id}`, updatedData)
//       .then((response) => {
//         setDonations((prevDonations) =>
//           prevDonations.map((donation) =>
//             donation._id === id ? response.data : donation
//           )
//         );
//         setIsEditModalOpen(false);
//       })
//       .catch((error) => console.error(error));
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-white border-r border-gray-200">
//         <SidebarNavigation />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 px-8 py-6">
//       <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <header className="mb-8">
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold text-gray-900">Donations Dashboard</h1>
//               <div className="flex gap-3">
//                 <Button 
//                   onClick={() => setIsCalendarOpen(!isCalendarOpen)}
//                   variant="outline"
//                   size="icon"
//                 >
//                   <Calendar className="h-5 w-5" />
//                 </Button>
//                 <Button 
//                   onClick={() => setIsModalOpen(true)}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   <Plus className="h-5 w-5 mr-2" />
//                   Add Donation
//                 </Button>
//               </div>
//             </div>
//           </header>

//           {/* Metrics Grid */}        
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                 >
//                   <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <h3 className="text-sm font-medium text-gray-500">
//                     Total Campaigns
//                     </h3>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-gray-900">{totalCampaigns}</div>
//                     <p className="text-xs text-gray-500">Active donation campaigns</p>
//                   </CardContent>
//                   </Card>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                 >
//                   <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <h3 className="text-sm font-medium text-gray-500">
//                     Total Collected
//                     </h3>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-emerald-600">
//                     ${totalCollected.toLocaleString()}
//                     </div>
//                     <p className="text-xs text-gray-500">Current donations received</p>
//                   </CardContent>
//                   </Card>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                 >
//                   <Card>
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <h3 className="text-sm font-medium text-gray-500">
//                     Target Amount
//                     </h3>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-blue-600">
//                     ${overallTargeted.toLocaleString()}
//                     </div>
//                     <p className="text-xs text-gray-500">Total campaign goals</p>
//                   </CardContent>
//                   </Card>
//                 </motion.div>
//                 </div>
            
//                 {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <Card className="p-6">
//               <div className="mb-4 flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">Donation Progress</h3>
//                 <Dropdown>
                            
//             <MenuButton>

//                 {selectedDonation === 'overall' ? 'All Donations' : selectedDonation}

//             </MenuButton>
//             <Menu>
//               <MenuItem onClick={() => setSelectedDonation('overall')}>
//                 All Donations
//               </MenuItem>
//               {donations.map((donation) => (
//                 <MenuItem 
//                   key={donation._id}
//                   onClick={() => setSelectedDonation(donation.title)}
//                 >
//                   {donation.title}
//                 </MenuItem>
//               ))}
//             </Menu>
//                 </Dropdown>

//               </div>
//               <div className="h-[300px]">
//                 <Line data={lineChartData} options={{ ...lineChartOptions, maintainAspectRatio: false }} />
//               </div>
//             </Card>

//             <Card className="p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Overview</h3>
//               <div className="h-[300px]">
//                 <Bar data={barChartData} options={{ ...barChartOptions, maintainAspectRatio: false }} />
//               </div>
//             </Card>
//           </div>

//         <div className="flex gap-2">
//           {/* Add Donation Button */}
//           <button
//             className="mb-6 px-4 py-2 bg-[#778DA9] text-white rounded hover:bg-[#415A77]"
//             onClick={() => setIsModalOpen(true)}
//           >
//             Add Donation
//           </button>
//           <button
//             className="mb-6 px-4 py-2 bg-transparent text-black rounded border-cyan-950 hover:bg-[#415A77]"
//             onClick={() => setIsCalendarOpen(!isCalendarOpen)}
//           >
//             <FiCalendar className="" />
//           </button>
//         </div>

//         {/* Calendar Modal */}
//         {isCalendarOpen && (
//           <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
//               <h2 className="text-xl font-bold mb-4">Donation Calendar</h2>
//               <FullCalendar
//                 plugins={[dayGridPlugin, timeGridPlugin]}
//                 initialView="dayGridMonth"
//                 headerToolbar={{
//                   left: "prev,next today",
//                   center: "title",
//                   right: "dayGridMonth,timeGridWeek,timeGridDay",
//                 }}
//                 events={events}
//                 height="80vh"
//                 eventClick={handleEventClick} // Attach the click handler
//               />
//               <button
//                 onClick={() => setIsCalendarOpen(false)}
//                 className="px-4 py-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Donation List */}
//         <Card>
//             <div className="rounded-md border">
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
//               </div>
//               <div className="relative overflow-x-auto">
//                 <table className="w-full text-sm text-left">
//                   <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3">Campaign</th>
//                       <th className="px-6 py-3 text-right">Target</th>
//                       <th className="px-6 py-3 text-right">Current</th>
//                       <th className="px-6 py-3 text-right">Progress</th>
//                       <th className="px-6 py-3 text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {donations.map((donation) => {
//                       const progress = (donation.currentAmount / donation.targetAmount) * 100;
//                       return (
//                         <tr key={donation._id} className="bg-white hover:bg-gray-50">
//                           <td className="px-6 py-4 font-medium text-gray-900">
//                             {donation.title}
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             ${donation.targetAmount.toLocaleString()}
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             ${donation.currentAmount.toLocaleString()}
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-2">
//                               <div className="w-full bg-gray-200 rounded-full h-2">
//                                 <div
//                                   className="bg-blue-600 h-2 rounded-full"
//                                   style={{ width: `${Math.min(progress, 100)}%` }}
//                                 />
//                               </div>
//                               <span className="text-sm text-gray-500">
//                                 {progress.toFixed(1)}%
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex justify-center gap-2">
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleViewDonation(donation._id)}
//                               >
//                                 <Eye className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => editDonation(donation)}
//                               >
//                                 <Edit2 className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleDelete(donation._id)}
//                                 className="text-red-600 hover:text-red-700"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>


      

//       {/* Add Donation Modal */}
//       {isModalOpen && (
//         <AddDonationModal
//           onClose={() => setIsModalOpen(false)}
//           onAdd={handleAddDonation}
//         />
//       )}

//       {/* Event Details Modal */}
//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
//             {/* Close Button */}
//             <button
//               onClick={closeEventModal}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             {/* Modal Header */}
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-semibold text-black">
//                 {selectedEvent.title}
//               </h2>
//               <p className="text-gray-500">{selectedEvent.description}</p>
//             </div>

//             {/* Modal Content */}
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <p>
//                   <strong className="text-black">Start Date:</strong>{" "}
//                   {new Date(selectedEvent.startDate).toLocaleDateString()}
//                 </p>
//               </div>

//               <div className="flex items-center">
//                 <p>
//                   <strong className="text-black">End Date:</strong>{" "}
//                   {new Date(selectedEvent.endDate).toLocaleDateString()}
//                 </p>
//               </div>

//               <div className="flex items-center">
//                 <p>
//                   <strong className="text-black">Target Amount:</strong> $
//                   {selectedEvent.targetAmount}
//                 </p>
//               </div>

//               <div className="flex items-center">
//                 <p>
//                   <strong className="text-black">Current Amount:</strong> $
//                   {selectedEvent.currentAmount}
//                 </p>
//               </div>
//             </div>

//             {/* Close Button */}
//             <div className="flex mt-6 gap-11 justify-center">
//               <div>

//               <button
//                 onClick={closeEventModal}
//                 className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:underline"
//               >
//                 Close
//               </button>
//               </div>
//               <div>

//               <button
//                 onClick={editDonation}
//                 className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:underline"
//               >
//                 Edit
//               </button>
//               </div>


//             </div>
//               {isEditModalOpen && selectedEvent && (
//                 <EditDonationModal
//                 isOpen={isEditModalOpen}
//                 onClose={() => setIsEditModalOpen(false)}
//                 donation={selectedDonation}
//                 onSave={handleSaveEdit}
//               />
//               )}


//           </div>
//         </div>
//       )}

// <ViewDonationModal 
//   isOpen={isViewModalOpen}
//   onClose={() => setIsViewModalOpen(false)}
//   donation={selectedDonation}
//   donationLog={donationLog}
//   onEdit={(donation) => {
//     setIsViewModalOpen(false);
//     setSelectedDonation(donation);
//     setIsEditModalOpen(true);
//   }}
// />
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, ChevronDown, Plus, Eye, Edit2, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import ViewDonationModal from './ViewDonationModal';
import EditDonationModal from './EditDonationModal';
import AddDonationModal from './AddnewDonationModal';

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  // State management
  const [donations, setDonations] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [donationLog, setDonationLog] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("overall");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  const [donationFilter, setDonationFilter] = useState({
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
  });

  // Fetch donations data
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/donations");
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  // Modal handlers
  const handleViewDonation = async (donationId,donation) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/donations/${donationId}`);
      console.log("data for viewing donation in modal", response);
      const { data } = response;
      setSelectedDonation(donation);
      
      // Sort and filter donation log
      let filteredLog = [...data.donations];
      
      // Apply amount filter
      if (donationFilter.minAmount) {
        filteredLog = filteredLog.filter(log => log.amount >= parseFloat(donationFilter.minAmount));
      }
      if (donationFilter.maxAmount) {
        filteredLog = filteredLog.filter(log => log.amount <= parseFloat(donationFilter.maxAmount));
      }
      
      // Apply date filter
      if (donationFilter.startDate) {
        filteredLog = filteredLog.filter(log => new Date(log.date) >= new Date(donationFilter.startDate));
      }
      if (donationFilter.endDate) {
        filteredLog = filteredLog.filter(log => new Date(log.date) <= new Date(donationFilter.endDate));
      }
      
      // Apply sorting
      filteredLog.sort((a, b) => {
        let comparison = 0;
        if (sortConfig.key === 'amount') {
          comparison = a.amount - b.amount;
        } else if (sortConfig.key === 'date') {
          comparison = new Date(a.date) - new Date(b.date);
        }
        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
      
      setDonationLog(filteredLog);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching donation details:", error);
    }
  };

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/donations/${id}`, updatedData);
      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation._id === id ? response.data : donation
        )
      );
      setIsEditModalOpen(false);
      fetchDonations(); // Refresh the list
    } catch (error) {
      console.error("Error updating donation:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        await axios.delete(`http://localhost:3001/api/donations/${id}`);
        setDonations(donations.filter(donation => donation._id !== id));
      } catch (error) {
        console.error("Error deleting donation:", error);
      }
    }
  };

  // Calculate metrics
  const totalCampaigns = donations.length;
  const totalCollected = donations.reduce((sum, donation) => sum + donation.currentAmount, 0);
  const overallTargeted = donations.reduce((sum, donation) => sum + donation.targetAmount, 0);

  // Filter donations based on search term
  const filteredDonations = donations.filter(donation =>
    donation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data
  const barChartData = {
    labels: filteredDonations.map(d => d.title),
    datasets: [
      {
        label: "Current Amount",
        data: filteredDonations.map(d => d.currentAmount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Target Amount",
        data: filteredDonations.map(d => d.targetAmount),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      }
    ]
  };

  // Line chart data preparation based on time range
  
  const getLineChartData = () => {
    const donationByDate = {};
    
    filteredDonations.forEach(donation => {
      donation.donations.forEach(log => {
        const date = new Date(log.date).toISOString().split('T')[0];
        donationByDate[date] = (donationByDate[date] || 0) + log.amount;
      });
    });

    const sortedDates = Object.keys(donationByDate).sort();
    const dailyAmounts = sortedDates.map(date => donationByDate[date]);

    return {
      labels: sortedDates,
      datasets: [{
        label: "Daily Donations",
        data: dailyAmounts,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4
      }]
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Donations Dashboard</h1>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Donation
            </Button>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              prefix={<Search className="h-4 w-4" />}
            />
          </div>
          {/* <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="day">Today</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Campaigns"
            value={totalCampaigns}
            subtitle="Active donation campaigns"
          />
          <MetricCard
            title="Total Collected"
            value={`RM${totalCollected.toLocaleString()}`}
            subtitle="Current donations received"
            valueClass="text-emerald-600"
          />
          <MetricCard
            title="Target Amount"
            value={`RM${overallTargeted.toLocaleString()}`}
            subtitle="Total campaign goals"
            valueClass="text-blue-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Donation Progress</h3>
            <div className="h-[300px]">
              <Line 
                data={getLineChartData()} 
                options={{ maintainAspectRatio: false }} 
              />
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Overview</h3>
            <div className="h-[300px]">
              <Bar 
                data={barChartData} 
                options={{ maintainAspectRatio: false }} 
              />
            </div>
          </Card>
        </div>

        {/* Donations Table */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-3">Campaign</th>
                  <th className="text-right py-3">Target</th>
                  <th className="text-right py-3">Current</th>
                  <th className="text-right py-3">Progress</th>
                  <th className="text-center py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map(donation => {
                  const progress = (donation.currentAmount / donation.targetAmount) * 100;
                  return (
                    <tr key={donation._id} className="border-t">
                      <td className="py-4">{donation.title}</td>
                      <td className="text-right">RM{donation.targetAmount.toLocaleString()}</td>
                      <td className="text-right">RM{donation.currentAmount.toLocaleString()}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDonation(donation._id,donation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(donation)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(donation._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modals */}
        <ViewDonationModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          donation={selectedDonation}
          donationLog={donationLog}
          onEdit={handleEdit}
          sortConfig={sortConfig}
          onSort={setSortConfig}
          filter={donationFilter}
          onFilterChange={setDonationFilter}
        />

        <EditDonationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          donation={selectedDonation}
          onSave={handleSaveEdit}
        />

        {/* <AddDonationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(newDonation) => {
            setDonations([...donations, newDonation]);
            setIsAddModalOpen(false);
          }}
        /> */}

<AddDonationModal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onAdd={(newDonation) => {
    setDonations([...donations, newDonation]);
    setIsAddModalOpen(false);
  }}
/>
      </div>
    </div>
  );
};

// Helper component for metric cards
const MetricCard = ({ title, value, subtitle, valueClass = "text-gray-900" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default AdminDashboard;