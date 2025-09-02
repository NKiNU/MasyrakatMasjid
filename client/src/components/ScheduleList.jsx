// import React from "react";

// function ScheduleList({ schedules }) {
//   return (
//     <div className="schedule-list">
//       {schedules.map((schedule, index) => (
//         <div key={schedule._id || index} className="schedule-item">
//           <h3>{schedule.title}</h3>
//           <p>{schedule.description}</p>
//           <p>{schedule.date} at {schedule.time}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ScheduleList;
import { useState, useEffect } from "react";
import ScheduleFormModal from "./ScheduleFormModal";
import { getSchedules, createSchedule } from "../api/scheduleApi";

function ScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchSchedules = async () => {
    try {
      const data = await getSchedules("/api/schedules"); 
      console.log(data)
      // setSchedules(data);      
      if (data && Array.isArray(data.data)) {
        setSchedules(data.data); 
      } else {
        setSchedules([]); 
        console.warn("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const addSchedule = async (newSchedule) => {
    try {
      // const response = await fetch("/api/schedules", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newSchedule),
      // });
      const response = await createSchedule(newSchedule);

      // if (response.ok) {
      // } else {
      //   console.error("Failed to add schedule");
      // }
      fetchSchedules(); // Refresh the list after adding a new schedule
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schedules</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Schedule
        </button>
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border"
            >
              {/* Image Preview */}
              {schedule.images && schedule.images.length > 0 ? (
                <img
                  src={schedule.images[0]}
                  alt="Schedule preview"
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No Image</p>
                </div>
              )}
              {/* Schedule Details */}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 ">{schedule.title}</h2>
                <p className="text-gray-600">{schedule.description}</p>
                <p className="text-gray-500 mt-2">
                  {schedule.date} at {schedule.time}
                </p>
              </div>
            </div>
          ))
                  ) : (
            <p>No schedules available.</p>
          )}
        </div>

      {/* Modal for adding a new schedule */}
      {showModal && (
        <ScheduleFormModal
          onClose={() => setShowModal(false)}
          onAdd={addSchedule}
        />
      )}
    </div>
  );
}

export default ScheduleList;
