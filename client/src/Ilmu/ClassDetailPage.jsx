import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
  Paper,
  Button,
  Modal,
  Backdrop,
  Fade,
  IconButton
  
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useLocation } from 'react-router-dom';
import PrayerTimes from '../components/WaktuSolat'; // Adjust the import path

export default function ClassDetailPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const location = useLocation();
  const { id } = useParams();
  const [musicScore, setMusicScore] = useState('');
  const [carouselItems, setCarouselItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);



  const navigationItems = [
    { path: '/activity', label: 'ACTIVITY',  },
    { path: '/homeMM', label: 'HOME', },
    { path: '/kuliyyah', label: 'CLASS', },
    { path: '/service', label: 'SERVICE AND SHOP',},
    { path: '/donation', label: 'DONATION', },
    { path: '/about', label: 'ABOUT', },
    { path: '/inbox', label: 'INBOX', },
    { path: '/profile', label: 'PROFILE', },
  ];

  const isImageLink = (link) => {
    return /\.(jpg|jpeg|png|gif)/i.test(link);
  };
  

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleJoinEvent = async () => {
    setOpenModal(true);
  };

  const handleConfirmation = async () => {
    // Handle confirmation action
    setConfirmation(true);
    // You can place your axios.post() call here if you want to execute it after confirmation
    try {
        // Make an HTTP POST request to your backend endpoint to create the data
        const response = await axios.post(`http://localhost:3001/createEventInbox`, {
          // Pass any necessary data to create the event
          className: musicScore.title, 
          // Example data to be sent
          // Include any other data you need to create the event
        });
    
        // Handle success response from the backend
        console.log('Event created successfully:', response.data);
      } catch (error) {
        // Handle errors
        console.error('Error creating event:', error);
      }
    setOpenModal(false);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 1300);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/classdetail/${id}`)
      .then((response) => {
        console.log(response);
        setMusicScore(response.data);
        setCarouselItems(response.data.media);
      })
      .catch((error) => {
        console.error('Error fetching music score details:', error);
      });
  }, [id]);

  const classFeeAmount = musicScore.classFee === 'free' ? 'Free' : musicScore.classFeeAmount === null ? 'Not specified' : musicScore.classFeeAmount === 0 ? 'Free' : musicScore.classFeeAmount;

  if (!musicScore) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 225, bgcolor: '#4169E1', p: 0 }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pt: 5,
          }}
        >
          <Typography variant="h6" sx={{ mt: 2, fontFamily: 'Montserrat', color: 'white' }}>
            Masyarakat Masjid
          </Typography>
        </Box>
        <List>
          {navigationItems.map((item) => (
            <ListItemButton
              key={item.path}
              sx={{
                width: '100%',
                bgcolor: location.pathname === item.path ? 'white' : 'inherit',
                color: location.pathname === item.path ? 'black' : 'white',
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'black' : 'white' }}>
                {item.icon}
              </ListItemIcon>
              <Link
                to={item.path}
                style={{
                  textDecoration: 'none',
                  color: location.pathname === item.path ? 'black' : 'white',
                }}
              >
                <ListItemText primary={item.label} sx={{ color: location.pathname === item.path ? 'black' : 'white' }} />
              </Link>
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', flexGrow: 1, p: 3 }}>
        <PrayerTimes setPrayerTimes={setPrayerTimes} />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3, }}>
            <Box sx={{ bgcolor: 'yellow', p: 2, borderRadius: 1, width: '150px', height: '100px' }}>
              <Typography variant="h6">Hijri</Typography>
              <Typography variant="body1">{prayerTimes ? prayerTimes.hijri : ''}</Typography>
            </Box>
            <Box sx={{ bgcolor: 'yellow', p: 2, borderRadius: 1, width: '150px', height: '100px' }}>
              <Typography variant="h6">Fajr</Typography>
              <Typography variant="body1">{prayerTimes ? formatTime(prayerTimes.fajr) : ''}</Typography>
            </Box>
            <Box sx={{ bgcolor: 'yellow', p: 2, borderRadius: 1, width: '150px', height: '100px' }}>
              <Typography variant="h6">Dhuhr</Typography>
              <Typography variant="body1">{prayerTimes ? formatTime(prayerTimes.dhuhr) : ''}</Typography>
            </Box>
            <Box sx={{ bgcolor: 'yellow', p: 2, borderRadius: 1, width: '150px', height: '100px' }}>
              <Typography variant="h6">Asr</Typography>
              <Typography variant="body1">{prayerTimes ? formatTime(prayerTimes.asr) : ''}</Typography>
            </Box>
            <Box sx={{ bgcolor: 'yellow', p: 2, borderRadius: 1, width: '150px', height: '100px' }}>
              <Typography variant="h6">Maghrib</Typography>
              <Typography variant="body1">{prayerTimes ? formatTime(prayerTimes.maghrib) : ''}</Typography>
            </Box>
            <Box sx={{ bgcolor: 'yellow', p: 2, borderRadius: 1, width: '150px', height: '100px' }}>
              <Typography variant="h6">Isha</Typography>
              <Typography variant="body1">{prayerTimes ? formatTime(prayerTimes.isha) : ''}</Typography>
            </Box>
          </Box>
          {carouselItems && carouselItems.length > 0 ? (
carouselItems.map((mediaItem, index) => (
  <Box key={index} style={{ position: 'relative', width: '100%', height: '400px', }}>
    {isImageLink(mediaItem) ? (
      <img
        src={mediaItem}
        alt={`Image ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          objectFit: 'cover',
          cursor: 'pointer', // Add cursor style for better UX
        }}
        onClick={() => setSelectedImage(mediaItem)}
      />
    ) : (
      <video
        src={mediaItem}
        controls
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          objectFit: 'cover',
        }}
      />
    )}
    <Box
      sx={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '8px',
        borderRadius: '0 0 4px 4px',
      }}
    >
      {/* Additional content */}
    </Box>
  </Box>
))
): (
  <Typography variant="body1">No images available</Typography>
)}



      
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {musicScore.mss_title}
          </Typography>
          <List>
          <ListItem>
  <ListItemText primary={<Typography variant="h2">{musicScore.title}</Typography>} />
</ListItem>
          <ListItem>
            <ListItemText primary="Description" secondary={musicScore.description} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Date Time" 
            secondary={new Date(musicScore.actdate).toLocaleString('en-US', { timeZone: 'Asia/Singapore', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })} />
          </ListItem>
          <ListItem>
    <ListItemText primary="Class Fee" secondary={classFeeAmount} />
  </ListItem>
          </List>
          <Button variant="contained" onClick={handleJoinEvent}>
            Join
          </Button>
        </Paper>
      </Box>

      {/* Confirmation Modal */}
      <Modal
  aria-labelledby="transition-modal-title"
  aria-describedby="transition-modal-description"
  open={openModal}
  onClose={() => setOpenModal(false)}
  closeAfterTransition
>
  <Fade in={openModal}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" id="transition-modal-title" align='center'>
          Confirmation
        </Typography>
        <Typography variant="body1" id="transition-modal-description">
          Are you sure you want to join this event?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" onClick={handleConfirmation} sx={{ bgcolor: 'green', color: 'white' }}>
  Confirm
</Button>

          <Button variant="outlined" onClick={() => setOpenModal(false)} sx={{ color: 'black', borderColor: 'black' }}>
  Cancel
</Button>
        </Box>
      </Paper>
    </Box>
  </Fade>
</Modal>
<Modal
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
        open={successMessage}
        onClose={() => setSuccessMessage(false)}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={successMessage}>
          <Box
            sx={{
              bgcolor: 'white',
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
              borderRadius: 8,
            }}
          >
            <Typography variant="h5" id="success-modal-title" gutterBottom>
              Success
            </Typography>
            <Typography variant="body1" id="success-modal-description">
              You successfully joined the class.
            </Typography>
          </Box>
        </Fade>
      </Modal>

      <Modal
  open={selectedImage !== null}
  onClose={() => setSelectedImage(null)}
  // Add any additional styles or properties for the modal
>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
  >
    <img
      src={selectedImage}
      alt="Selected Image"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    />
  </Box>
</Modal>

<Modal
  open={selectedImage !== null}
  onClose={() => setSelectedImage(null)}
  // Add any additional styles or properties for the modal
>
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    }}
  >
    <Box
      sx={{
        position: 'relative',
        maxWidth: '90%',
        maxHeight: '90%',
        overflow: 'auto'
      }}
    >
      <IconButton
        onClick={() => setSelectedImage(null)}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for button
          borderRadius: '50%', // Make the button circular
        }}
      >
        <CloseIcon />
      </IconButton>
      <img
        src={selectedImage}
        alt="Selected Image"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </Box>
  </Box>
</Modal>


    </Box>
  );
}
