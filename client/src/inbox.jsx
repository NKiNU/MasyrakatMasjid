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
  TableBody,
  IconButton
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
import PrayerTimes from './prayerTime';
import axios from 'axios';

export default function InboxPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const location = useLocation();
  const [ClassList, setClassList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inboxes, setInboxes] = useState([]);

  useEffect(() => {
    fetchInboxes();
  }, []);

  const fetchInboxes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/inboxes');
      setInboxes(response.data);
    } catch (error) {
      console.error('Error fetching inbox list:', error);
    }
  };

  const handleDelete = async (inboxId) => {
    try {
      await axios.delete(`http://localhost:3001/inboxes/${inboxId}`);
      setInboxes(inboxes.filter(inbox => inbox._id !== inboxId));
    } catch (error) {
      console.error('Error deleting inbox:', error);
    }
  }

  const handleCellClick = async (inboxId, opened) => {
    if (!opened) {
      try {
        await axios.put(`http://localhost:3001/inboxes/${inboxId}`, { opened: true });
        // Update local state to reflect the change
        setInboxes(prevInboxes =>
          prevInboxes.map(inbox =>
            inbox._id === inboxId ? { ...inbox, opened: true } : inbox
          )
        );

        setUnreadCount(prevCount => prevCount - 1);
      } catch (error) {
        console.error('Error updating inbox:', error);
      }
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

  const carouselRef = useRef(null);

  useEffect(() => {
    fetchClassList();
    axios
      .get(`http://localhost:3001/unreadMessagesCount`)
      .then((response) => {
        console.log(response.data.count);
        setUnreadCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching unread messages count:", error);
      });
  }, []);

  const fetchClassList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/class');
      setClassList(response.data);
    } catch (error) {
      console.error('Error fetching activity list:', error);
    }
  };

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
            <Typography variant="h4" gutterBottom>
              Inbox
            </Typography>
            <TableContainer component={Paper}>
            <Table>
  <TableHead>
    <TableRow>
      <TableCell sx={{ width: '70%', fontWeight: 'bold' }}>Title</TableCell>
      <TableCell sx={{ width: '20%', textAlign: 'center', fontWeight: 'bold' }}>Time</TableCell>
      <TableCell sx={{ width: '10%', textAlign: 'center', fontWeight: 'bold' }}>Actions</TableCell> {/* New column for actions */}
    </TableRow>
  </TableHead>
  <TableBody>
    {inboxes.map((inbox) => (
      <TableRow
        key={inbox._id}
        sx={{ bgcolor: inbox.opened ? 'inherit' : '#f0f0f0' }}
        onClick={() => handleCellClick(inbox._id, inbox.opened)}
        style={{ cursor: inbox.opened ? 'default' : 'pointer' }}
      >
        <TableCell>
          <Link to={`/inbox/${inbox._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {inbox.className}
          </Link>
        </TableCell>
        <TableCell align='center'>
          {new Date(inbox.createdDatetime).toLocaleString('en-US', {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </TableCell>
        <TableCell align='center'>
          <Button onClick={() => handleDelete(inbox._id)}sx={{
              backgroundColor: 'red',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkred'
              }
            }}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

            </TableContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
}
