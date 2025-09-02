import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PrayerTimes from "../components/WaktuSolat";
import axios from "axios";
import SidebarNavigation from "../components/SideBar/SideNavBar";

export default function KuliyyahPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [kuliyyahList, setKuliyyahList] = useState([]);

  useEffect(() => {
    fetchKuliyyahList();
  }, []);

  const fetchKuliyyahList = async () => {
    try {
      const response = await axios.get("http://localhost:3001/kuliyyah");
      setKuliyyahList(response.data);
    } catch (error) {
      console.error("Error fetching kuliyyah list:", error);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/kuliyyah/${id}`);
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

        {/* Kuliyyah Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {kuliyyahList.map((kuliyyah, index) => (
            <div
              key={index}
              className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden"
              onClick={() => handleCardClick(kuliyyah._id)}
            >
              <img
                src={kuliyyah.media[0] || "default-image.jpg"}
                alt={kuliyyah.title}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">
                  {kuliyyah.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



