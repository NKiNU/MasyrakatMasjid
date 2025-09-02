import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PrayerTimes from "../components/WaktuSolat";
import axios from "axios";
import SidebarNavigation from "../components/SideBar/SideNavBar";

export default function ClassPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [classList, setClassList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassList();
  }, []);

  const fetchClassList = async () => {
    try {
      const classResponse = await axios.get("http://localhost:3001/class");
      const flagResponse = await axios.get("http://localhost:3001/flagged");

      const flaggedIds = flagResponse.data
        .filter((flag) => flag.status === "flagged")
        .map((flag) => flag.contentId);

      const filteredClassList = classResponse.data.filter(
        (Class) => !flaggedIds.includes(Class._id)
      );

      setClassList(filteredClassList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching class list:", error);
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/class/${id}`);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-500 text-white">
        <SidebarNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto p-4">
        <PrayerTimes setPrayerTimes={setPrayerTimes} />

        {/* Prayer Times */}
        <div className="grid grid-cols-6 gap-4 my-4">
          {["Hijri", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
            (timeKey, index) => (
              <div
                key={index}
                className="bg-yellow-300 p-4 rounded-md text-center"
              >
                <h6 className="text-lg font-bold">{timeKey}</h6>
                <p className="text-sm">
                  {prayerTimes
                    ? timeKey === "Hijri"
                      ? prayerTimes.hijri
                      : formatTime(prayerTimes[timeKey.toLowerCase()])
                    : ""}
                </p>
              </div>
            )
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 my-4">
          <Link
            to="/kuliyyah"
            className={`px-4 py-2 rounded-md ${
              location.pathname === "/kuliyyah"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Kuliyyah
          </Link>
          <Link
            to="/kuliyyah/class"
            className={`px-4 py-2 rounded-md ${
              location.pathname === "/kuliyyah/class"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Class
          </Link>
        </div>

        {/* Class Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <div className="loader"></div>
            </div>
          ) : (
            classList.map((Class, index) => (
              <div
                key={index}
                className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden"
                onClick={() => handleCardClick(Class._id)}
              >
                <img
                  src={Class.media[0] || "default-image.jpg"}
                  alt={Class.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {Class.title}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
