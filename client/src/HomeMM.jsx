import React, { useState,useEffect,useRef } from 'react';
import {
  Box,
  List,
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
import PrayerTimes from './prayerTime'; // Adjust the import path

export default function HomeMM() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const location = useLocation();

  const carouselItems = [
    {
      imgSrc: 'https://ikram.org.my/wp-content/uploads/2023/04/tauliah-agama.jpg',
      text: 'First Slide Text',
    },
    {
      imgSrc: 'https://lh6.googleusercontent.com/p-Hh0HsgCLOnEimhrrBRJMgriOJ2n1uSMWbulbaRGoTQwws8ntxpB--8EFtw2v7V0XkCkWCd6lpzMPJ_hYVWQoDhYaiAu8mPzqUaK9jbjmT21v967xGuA565azN6r1mOuTTDmSD7TaMD6UJR-I8',
      text: 'Second Slide Text',
    },
    {
      imgSrc: 'https://waktu.ai/wp-content/uploads/2024/04/UCAPAN-SELAMAT-HARI-RAYA.jpg',
      text: 'Third Slide Text',
    },
  ];

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

  const carouselRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
        const nextScrollLeft = scrollLeft + clientWidth;
        if (nextScrollLeft >= scrollWidth) {
          carouselRef.current.scrollLeft = 0;
        } else {
          carouselRef.current.scrollLeft += clientWidth;
        }
      }
    }, 3000); // Change the interval time to 3000 milliseconds for 3 seconds
  
    return () => clearInterval(intervalId);
  }, []);
  
    

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
          <Box sx={{ minWidth: '100%', overflowX: 'auto' }}>  
          <Box ref={carouselRef} sx={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
  {carouselItems.map((item, index) => (
    <Box
      key={index}
      sx={{
        display: 'inline-block',
        position: 'relative', // Make the position relative to position the text overlay
        width: '100%', // Set the width of each carousel item to the viewport width
        height: '500px', // Set the height of each carousel item
        borderRadius: '4px',
        marginRight: '0px', // Add margin between carousel items
        backgroundImage: `url(${item.imgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
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
        <Typography variant="h5">{item.text}</Typography>
      </Box>
    </Box>
  ))}
</Box>

<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
  {/* First column */}
  <Box sx={{ display: 'flex' }}>
    <Typography variant="h7">Info</Typography>
  </Box>

  {/* Second column */}
  <Box sx={{ flex: '1', marginRight: '10px' }}>
    <Box ref={carouselRef} sx={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
      {/* Carousel items */}
      {carouselItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'inline-block',
            position: 'relative',
            width: '100%',
            height: '400px',
            borderRadius: '4px',
            marginRight: '0px',
            backgroundImage: `url(${item.imgSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Text overlay */}
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
            <Typography variant="h5">{item.text}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>

  {/* Third column */}
  <Box sx={{ flex: '1', marginLeft: '10px' }}>
    <Typography variant="h7">Kuliyyah</Typography>
  </Box>
</Box>


        </Box>
        </Box>
</Box>
      
    </>
  );
}
