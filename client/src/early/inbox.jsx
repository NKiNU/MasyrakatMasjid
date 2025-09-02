import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PrayerTimes from "../components/WaktuSolat";
import axios from "axios";
import SidebarNavigation from "../components/SideBar/SideNavBar";

export default function InboxPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [inboxes, setInboxes] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInboxes();
    fetchUnreadCount();
  }, []);

  const fetchInboxes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/inboxes");
      setInboxes(response.data);
    } catch (error) {
      console.error("Error fetching inbox list:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get("http://localhost:3001/unreadMessagesCount");
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/inbox/${id}`);
  };

  const handleDelete = async (inboxId) => {
    try {
      await axios.delete(`http://localhost:3001/inboxes/${inboxId}`);
      setInboxes(inboxes.filter((inbox) => inbox._id !== inboxId));
    } catch (error) {
      console.error("Error deleting inbox:", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const navigationItems = [
    { path: "/activity", label: "ACTIVITY" },
    { path: "/homeMM", label: "HOME" },
    { path: "/kuliyyah", label: "CLASS" },
    { path: "/service", label: "SERVICE AND SHOP" },
    { path: "/donation", label: "DONATION" },
    { path: "/about", label: "ABOUT" },
    { path: "/inbox", label: unreadCount === 0 ? "INBOX" : `INBOX (${unreadCount})` },
    { path: "/profile", label: "PROFILE" },
  ];

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
          {["Hijri", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((timeKey, index) => (
            <div key={index} className="bg-yellow-300 p-4 rounded-md text-center">
              <h6 className="text-lg font-bold">{timeKey}</h6>
              <p className="text-sm">
                {prayerTimes
                  ? timeKey === "Hijri"
                    ? prayerTimes.hijri
                    : formatTime(prayerTimes[timeKey.toLowerCase()])
                  : ""}
              </p>
            </div>
          ))}
        </div>

        {/* Inbox Table */}
        <div className="flex flex-col gap-4 my-4">
          <h2 className="text-2xl font-semibold">Inbox</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left font-bold">Title</th>
                  <th className="px-4 py-2 text-left font-bold">Time</th>
                  <th className="px-4 py-2 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inboxes.map((inbox) => (
                  <tr
                    key={inbox._id}
                    className={`${inbox.opened ? "bg-white" : "bg-gray-100"} hover:bg-gray-200 cursor-pointer`}
                    onClick={() => handleCardClick(inbox._id)}
                  >
                    <td className="px-4 py-2">
                      <Link to={`/inbox/${inbox._id}`} className="text-blue-500">
                        {inbox.className}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{formatTime(inbox.createdDatetime)}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(inbox._id);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


