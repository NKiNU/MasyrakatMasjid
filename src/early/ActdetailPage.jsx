
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {

  Paper,

} from '@mui/material';
import React, { useState,useEffect,useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
  Card,
  CardContent,
  CardMedia
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
import PrayerTimes from '../components/WaktuSolat'; // Adjust the import path

export default function CustomerMusicScoreView(){
  const [prayerTimes, setPrayerTimes] = useState(null);
  const location = useLocation();
  const { id } = useParams();
  const [musicScore, setMusicScore] = useState(null);

  const navigationItems = [
    { path: '/activity', label: 'ACTIVITY',  },
    { path: '/homeMM', label: 'HOME', },
    { path: '/kuliyyah', label: 'CLASS', },
    { path: '/service', label: 'SERVICE AND SHOP',},
    { path: '/donation', label: 'DONATION', },
    { path: '/about', label: 'ABOUT', },
    { path: '/inbox', label: 'INBOX', },
    { path: '/profile', label: 'PROFILE', }
  ];
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


  useEffect(() => {
    axios
      .get(`http://localhost:3001/activitydetail/${id}`)
      .then((response) => {
        setMusicScore(response.data);
      })
      .catch((error) => {
        console.error("Error fetching music score details:", error);
      });
  }, [id]);

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
            {/* Replace with your actual logo */}
            {/* <img src="C:\Users\acer\Desktop\MM2\client\src\assets\react.svg" alt="MozartifyIcon" style={{ maxWidth: '100%', maxHeight: '48px' }} /> */}
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
    <Box sx={{ display:'flex',flexDirection: 'column',overflow:"auto", flexGrow: 1, p: 3 }}>
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
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {musicScore.mss_title}
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Genre" secondary={musicScore.title} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Composer" secondary={musicScore.description} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Class Date Time" secondary={musicScore.actdate} />
          </ListItem>
          <ListItem>
  <ListItemText 
    primary="Created Date Time" 
    secondary={new Date(musicScore.datetime).toLocaleString('en-US', {timeZone: 'Asia/Singapore'})} 
  />
</ListItem>


          {/* Add more fields as necessary */}
        </List>
      </Paper>
    </Box>
    </Box>
    
  );
};