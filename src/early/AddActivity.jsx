import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import PrayerTimes from '../components/WaktuSolat'; // Adjust the import path
import axios from 'axios';
import { imgDB } from '../util/fireabseStorage';// Import the storage from your firebaseConfig file
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CircularProgress } from '@mui/material';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
  }
`;

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

export default function AddActivityPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [classDateTime, setClassDateTime] = useState(null);
  const [classType, setClassType] = useState('');
  const [onlineLink, setOnlineLink] = useState('');
  const [classFee, setClassFee] = useState('');
  const [classFeeAmount, setClassFeeAmount] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);    
  const navigate = useNavigate()        

  const categories = ['kuliyyah', 'class', 'donation', 'donation report'];

  const handleImageChange = (event) => {
    const files = event.target.files;
    const previews = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
        reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setImageFiles(files);
          setImagePreviews(previews);
        }
      };
  
      reader.readAsDataURL(file);
    }
  };

  const resetUIState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  useEffect(() => {
    // If success is true, set a timeout to reset the UI state after 1400ms
    if (success) {
      const timer = setTimeout(resetUIState, 1400);
      // Clear the timeout when the component unmounts to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [success]);
  

  
  const handleVideoChange = (event) => {
    setVideoFiles(event.target.files);
  };

  const uploadFiles = async (files) => {
    const uploadPromises = [];
    for (const file of files) {
      const storageRef = ref(imgDB, `uploads/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file)
        .then(snapshot => getDownloadURL(snapshot.ref));
      uploadPromises.push(uploadTask);
    }
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentDateAndTime = new Date().toLocaleString();
    try {
      // Show loading spinner
      setLoading(true);
  
      const imageUrls = await uploadFiles(imageFiles);
      const videoUrls = await uploadFiles(videoFiles);
  
      const mediaUrls = [...imageUrls, ...videoUrls];
  
      const activityData = {
        title,
        description,
        category,
        datetime: currentDateAndTime,
        media: mediaUrls,
      };
  
      if (category === 'class') {
        activityData.actdate = classDateTime;
        activityData.classType = classType;
        activityData.classFee = classFee;
        if (classType === 'online') {
          activityData.onlineLink = onlineLink;
        }
        if (classFee === 'paid') {
          activityData.classFeeAmount = classFeeAmount;
        }
      }
  
      const response = await axios.post('http://localhost:3001/addactivity', activityData);
      console.log('Activity added successfully:', response.data);
      // Hide loading spinner
      setLoading(false);
      // Show success message
      setSuccess(true);
      // Navigate to "/activity" page after 1400ms
      setTimeout(() => {
        navigate('/activity');
      }, 1400);
    } catch (error) {
      console.error('Error adding activity:', error);
      // Hide loading spinner
      setLoading(false);
      // Show error message
      setError(true);
    }
  };
  

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <GlobalStyle />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box sx={{ width: 225, bgcolor: '#4169E1', p: 0, position: 'fixed', top: 0, left: 0, bottom: 0, overflowY: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 5 }}>
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
        <Box sx={{ flexGrow: 1, p: 3 }}>
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
            <Box sx={{ bgcolor: 'yellow', p: 2, borderRadius: 1, width: '150px', height: '100                    px' }}>
                  <Typography variant="h6">Maghrib</Typography>
                  <Typography variant="body1">{prayerTimes ? formatTime(prayerTimes.maghrib) : ''}</Typography>
                </Box>
                <Box sx={{ bgcolor: 'yellow', p: 2, borderRadius: 1, width: '150px', height: '100px' }}>
                  <Typography variant="h6">Isha</Typography>
                  <Typography variant="body1">{prayerTimes ? formatTime(prayerTimes.isha) : ''}</Typography>
                </Box>
              </Box>
              <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
                <Typography variant="h4" gutterBottom>
                  Add New Activity
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    required
                  />
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {category === 'class' && (
                    <>
                      <RadioGroup
                        aria-label="class-type"
                        name="class-type"
                        value={classType}
                        onChange={(e) => setClassType(e.target.value)}
                        row
                      >
                        <FormControlLabel value="online" control={<Radio />} label="Online" />
                        <FormControlLabel value="physical" control={<Radio />} label="Physical" />
                      </RadioGroup>
                      {classType === 'online' && (
                        <TextField
                          label="Online Class Link"
                          value={onlineLink}
                          onChange={(e) => setOnlineLink(e.target.value)}
                          fullWidth
                          margin="normal"
                          required
                        />
                      )}
                      <RadioGroup
                        aria-label="class-fee"
                        name="class-fee"
                        value={classFee}
                        onChange={(e) => setClassFee(e.target.value)}
                        row
                      >
                        <FormControlLabel value="free" control={<Radio />} label="Free" />
                        <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                      </RadioGroup>
                      {classFee === 'paid' && (
                        <TextField
                          label="Class Fee Amount"
                          type="number"
                          value={classFeeAmount}
                          onChange={(e) => setClassFeeAmount(e.target.value)}
                          fullWidth
                          margin="normal"
                          required
                        />
                      )}
                      <TextField
                        type="datetime-local"
                        value={classDateTime}
                        onChange={(e) => setClassDateTime(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                      />
                    </>
                  )}
<Box mt={2}>
  <InputLabel htmlFor="image-files">Upload Images</InputLabel>
  <input
    id="image-files"
    type="file"
    multiple
    accept="image/*"
    onChange={handleImageChange}
    style={{ marginTop: '10px' }}
  />
  <div>
  {imagePreviews.map((preview, index) => (
  <img key={index} src={preview} alt={`Preview ${index}`} style={{ width: '200px', height: '200px', marginRight: '10px' }} />
))}

  </div>
</Box>
                  <Box mt={2}>
                    <InputLabel htmlFor="video-files">Upload Videos</InputLabel>
                    <input
                      id="video-files"
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoChange}
                      style={{ marginTop: '10px' }}
                    />
                  </Box>
                  <Box mt={3}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Submit
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </Box>
        </>
      );
    }

