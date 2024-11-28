import React, { useState, useEffect, useRef,  } from 'react';
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
  CircularProgress,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import PrayerTimes from '../prayerTime';
import axios from 'axios';

export default function ClassPage() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const location = useLocation();
  const [ClassList, setClassList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('community'); 
  const navigate = useNavigate()


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

  const isImageLink = (link) => {
    return /\.(jpg|jpeg|png|gif)/i.test(link);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const navigateToAddActivity = () => {
    navigate('/addactivity');
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
      const classResponse = await axios.get('http://localhost:3001/class');
      const flagResponse = await axios.get('http://localhost:3001/flagged'); // Assuming the endpoint for flag collection is '/flagCollection'
  
      const flaggedIds = flagResponse.data
        .filter(flag => flag.status === 'flagged')
        .map(flag => flag.contentId);
  
      const filteredClassList = classResponse.data.filter(Class => !flaggedIds.includes(Class._id));
  
      setClassList(filteredClassList);
      setLoading(false); // Set loading to false when data is loaded
    } catch (error) {
      console.error('Error fetching activity list:', error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  const navigationItems = [
    { path: '/activity', label: 'ACTIVITY',  },
    { path: '/homeMM', label: 'HOME', },
    { path: '/kuliyyah', label: 'CLASS', },
    { path: '/service', label: 'SERVICE AND SHOP', },
    { path: '/donation', label: 'DONATION', },
    { path: '/about', label: 'ABOUT', },
    { path: '/inbox', label: `INBOX (${unreadCount})`, }, // Use backticks here
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
    bgcolor: location.pathname === item.path || (item.path === '/kuliyyah' && location.pathname === '/class') ? 'white' : 'inherit',
    color: location.pathname === item.path || (item.path === '/kuliyyah' && location.pathname === '/class') ? 'black' : 'white',
  }}
  onClick={() => {
    if (item.path === '/class') {
      navigate('/kuliyyah');
    }
  }}
>

                <ListItemIcon sx={{ color: location.pathname === item.path || (item.path === '/kuliyyah' && location.pathname === '/class') ? 'black' : 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <Link
  to={item.path === '/class' ? '/kuliyyah' : item.path}
  style={{
    textDecoration: 'none',
    color: location.pathname === item.path || (item.path === '/kuliyyah' && location.pathname === '/class') ? 'black' : 'white',
  }}
>

<ListItemText primary={item.label} sx={{ color: location.pathname === item.path || (item.path === '/kuliyyah' && location.pathname === '/class') ? 'black' : 'white' }} />
                </Link>
              </ListItemButton>
            ))}
          </List>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="select option"
              name="option"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <FormControlLabel value="community" control={<Radio />} label="Community" />
              <FormControlLabel value="committee" control={<Radio />} label="Committee" />
            </RadioGroup>
          </FormControl>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Link to="/kuliyyah">
              <Button variant={location.pathname === '/kuliyyah' ? 'contained' : 'outlined'}>
                Kuliyyah
              </Button>
            </Link>
            <Link to="/other">
              <Button variant={location.pathname === '/class' ? 'contained' : 'outlined'}>
                Class
              </Button>
            </Link>
          </Box>
          <Box sx={{ display: selectedOption === 'committee' ? 'block' : 'none', top: 10, right: 10 }}>
            <Button onClick={navigateToAddActivity} variant="contained" color="primary">
              Add New Class
            </Button>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {ClassList.map((Class, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Link to={`/class/${Class._id}`} style={{ textDecoration: 'none' }}>
                    <Card>
                    <CardMedia
                        component={isImageLink(Class.media[0]) ? 'img' : 'video'}
                        height="140"
                        src={Class.media[0]} // Replace 'default-image.jpg' with a default image URL if needed
                        alt={isImageLink(Class.media[0]) ? `Image ${index + 1}` : undefined}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div" sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                          {Class.title}
                        </Typography>
                    
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
}
