import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PrayerTimes from "../components/WaktuSolat";
import SidebarNavigation from "../components/SideBar/SideNavBar";
import { Modal, Fade, Box, Typography, Button, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function KuliyyahDetailPage() {
  const { id } = useParams();
  const [kuliyyah, setKuliyyah] = useState(null);
  const [carouselItems, setCarouselItems] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/classdetail/${id}`)
      .then((response) => {
        setKuliyyah(response.data);
        setCarouselItems(response.data.media);
      })
      .catch((error) => {
        console.error("Error fetching kuliyyah details:", error);
      });
  }, [id]);

  const isImageLink = (link) => /\.(jpg|jpeg|png|gif)/i.test(link);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleJoinEvent = () => {
    setOpenModal(true);
  };

  const handleConfirmation = async () => {
    try {
      await axios.post(`http://localhost:3001/createEventInbox`, {
        className: kuliyyah.title,
      });
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 1300);
    } catch (error) {
      console.error("Error creating event:", error);
    }
    setOpenModal(false);
  };

  const navigationItems = [
    { path: "/activity", label: "ACTIVITY" },
    { path: "/homeMM", label: "HOME" },
    { path: "/kuliyyah", label: "CLASS" },
    { path: "/service", label: "SERVICE AND SHOP" },
    { path: "/donation", label: "DONATION" },
    { path: "/about", label: "ABOUT" },
    { path: "/inbox", label: "INBOX" },
    { path: "/profile", label: "PROFILE" },
  ];

  if (!kuliyyah) {
    return <Typography>Loading...</Typography>;
  }

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

        {/* Carousel */}
        {carouselItems && carouselItems.length > 0 && carouselItems.map((mediaItem, index) => (
          <div key={index} className="relative mb-3">
            {isImageLink(mediaItem) ? (
              <img
                src={mediaItem}
                alt={`Image ${index + 1}`}
                className="w-full h-96 object-cover cursor-pointer"
                onClick={() => setSelectedImage(mediaItem)}
              />
            ) : (
              <video
                src={mediaItem}
                controls
                className="w-full h-96 object-cover"
              />
            )}
          </div>
        ))}

        {/* Kuliyyah Details */}
        <Paper className="p-4">
          <Typography variant="h4" gutterBottom>
            {kuliyyah.title}
          </Typography>
          <Typography variant="body1" className="mb-4">
            {kuliyyah.description}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleJoinEvent}>
            Join Event
          </Button>
        </Paper>
      </div>

      {/* Modal: Confirmation */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} closeAfterTransition>
        <Fade in={openModal}>
          <Box className="flex justify-center items-center h-full">
            <Paper className="p-4">
              <Typography variant="h5" align="center">Confirmation</Typography>
              <Typography variant="body1" align="center">
                Are you sure you want to join this event?
              </Typography>
              <div className="flex justify-between mt-4">
                <Button variant="contained" color="success" onClick={handleConfirmation}>
                  Confirm
                </Button>
                <Button variant="outlined" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
              </div>
            </Paper>
          </Box>
        </Fade>
      </Modal>

      {/* Modal: Success */}
      <Modal open={successMessage} onClose={() => setSuccessMessage(false)} closeAfterTransition>
        <Fade in={successMessage}>
          <Box className="bg-white shadow-lg p-6 text-center rounded-lg">
            <Typography variant="h5">Success</Typography>
            <Typography variant="body1">You successfully joined the class.</Typography>
          </Box>
        </Fade>
      </Modal>

      {/* Modal: Image Preview */}
      <Modal open={selectedImage !== null} onClose={() => setSelectedImage(null)}>
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative max-w-90% max-h-90%">
            <IconButton onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 text-white bg-opacity-50 rounded-full p-2">
              <CloseIcon />
            </IconButton>
            <img src={selectedImage} alt="Selected" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
