import React, { useEffect, useState } from 'react';
import { getSchedules,createSchedule } from '../api/scheduleApi';
import ScheduleForm from '../components/ScheduleForm';
import ScheduleList from '../components/ScheduleList';
import SidebarNavigation from '../components/SideBar/SideNavBar';

function SchedulePage() {
  const [schedules, setSchedules] = useState([]);

//   useEffect(() => {
//     const fetchSchedules = async () => {
//       try {
//         const { data } = await getSchedules();
//         setSchedules(data);
//       } catch (error) {
//         console.error('Error fetching schedules:', error);
//       }
//     };
//     fetchSchedules();
//   }, []);

//   const handleAdd = async (newSchedule) => {
//     newSchedule=await createS(newSchedule);
//     setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
//   };

//   const handleDelete = (id) => {
//     setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule._id !== id));
//   };

  return (
    <div className='flex h-screen'>
    <div className='w-64 bg-gray-100 dark:bg-gray-800'>
      {<SidebarNavigation/>}
    </div>
    <div className='flex-1 p-6'>
      <ScheduleList/>
      {/* <ScheduleForm onAdd={handleAdd} /> */}
      {/* <ScheduleList schedules={schedules} onDelete={handleDelete} /> */}
    </div>
    </div>
  );
}

export default SchedulePage;
