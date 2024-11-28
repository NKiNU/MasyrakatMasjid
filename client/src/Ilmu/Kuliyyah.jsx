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
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import PrayerTimes from '../prayerTime';
import axios from 'axios';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
  }
`;

export default function KuliyyahPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [kuliyyahList, setKuliyyahList] = useState([]);

  const carouselRef = useRef(null);

  useEffect(() => {
    fetchKuliyyahList();
  }, []);

  const fetchKuliyyahList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/kuliyyah');
      setKuliyyahList(response.data);
    } catch (error) {
      console.error('Error fetching activity list:', error);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/kuliyyah/${id}`);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', flexGrow: 1, p: 3 }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Link to="/kuliyyah">
              <Button variant={location.pathname === '/kuliyyah' ? 'contained' : 'outlined'}>
                Kuliyyah
              </Button>
            </Link>
            <Link to="/class">
              <Button variant={location.pathname === '/class' ? 'contained' : 'outlined'}>
                Class
              </Button>
            </Link>
          </Box>
          <Grid container spacing={2}>
            {kuliyyahList.map((kuliyyah, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card onClick={() => handleCardClick(kuliyyah._id)} sx={{ cursor: 'pointer' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={kuliyyah.media[0] || 'default-image.jpg'} // Replace 'default-image.jpg' with a default image URL if needed
                    alt={kuliyyah.title}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div"  sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                      {kuliyyah.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
