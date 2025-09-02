import { useParams ,useNavigate} from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useLocation } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import PrayerTimes from '../components/WaktuSolat';
import axios from 'axios';


export default function InboxDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [inboxes, setInboxes] = useState([]);

  useEffect(() => {
    fetchInboxes();
}, []);
  

  const fetchInboxes = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/inboxes/${id}`);
      setInboxes(response.data);
    } catch (error) {
      console.error('Error fetching inbox list:', error);
    }
  };



  const GlobalStyle = createGlobalStyle`
    body {
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', sans-serif;
    }
  `;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const handleDelete = async (inboxId) => {
    try {
      await axios.delete(`http://localhost:3001/inboxes/${inboxId}`);
      navigate('/inbox'); 
    } catch (error) {
      console.error('Error deleting inbox:', error);
    }
  }

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('http://localhost:3001/unreadMessagesCount');
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error('Error fetching unread messages count:', error);
      }
    };

  


    // Fetch the initial unread count
    fetchUnreadCount();

  }, []);

  const navigationItems = [
    { path: '/activity', label: 'ACTIVITY',  },
    { path: '/homeMM', label: 'HOME', },
    { path: '/kuliyyah', label: 'CLASS', },
    { path: '/service', label: 'SERVICE AND SHOP',},
    { path: '/donation', label: 'DONATION', },
    { path: '/about', label: 'ABOUT', },
    { path: '/inbox', label: unreadCount === 0 ? 'INBOX' : `INBOX (${unreadCount})`, }, // Use backticks here
    { path: '/profile', label: 'PROFILE', }
  ];
  

  return (
    <>
      <GlobalStyle />
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
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: "auto", flexGrow: 1, p: 3 }}>
          <PrayerTimes setPrayerTimes={setPrayerTimes} />
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
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
          {/* Buttons Container */}

          <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Inbox Detail
        </Typography>
        <Button onClick={() => handleDelete(inboxes._id)}
          sx={{
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkred'
            }
          }}
        >
          Delete
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: "auto", flexGrow: 1, p: 3 }}>
        {inboxes && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Title: {inboxes.className}
            </Typography>
            <Typography variant="body1">
              Description: {inboxes.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
        </Box>
      </Box>
    </>
  );
}
