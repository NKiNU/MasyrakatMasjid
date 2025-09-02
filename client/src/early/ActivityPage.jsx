import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
  Button,
  TextField,
  Modal,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import PrayerTimes from '../components/WaktuSolat';
import SidebarNavigation from '../components/SideBar/SideNavBar';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
  }
`;

export default function ActivityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activityList, setActivityList] = useState([]);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [flaggedActivities, setFlaggedActivities] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState('');
  const [isFlagModalOpen, setFlagModalOpen] = useState(false);
  const [flagMessage, setFlagMessage] = useState('');
  const [activityToFlag, setActivityToFlag] = useState('');
  const [flagStatus, setFlagStatus] = useState('');

  const handleTitleClick = (activity) => {
    if (activity.category === 'class') {
      navigate(`/class/${activity._id}`);
    } else if (activity.category === 'kuliyyah') {
      navigate(`/kuliyyah/${activity._id}`);
    }
  };

  const handleFlagClick = (activityId, currentStatus) => {
    setActivityToFlag(activityId);
    setFlagModalOpen(true);
    setFlagStatus(currentStatus);
  };

  const handleConfirmFlag = async () => {
    try {
      await axios.post('http://localhost:3001/flag', {
        contentId: activityToFlag,
        message: flagMessage,
        status: flagStatus === 'flagged' ? 'unflagged' : 'flagged',
        unflagMessage: flagStatus === 'flagged' ? flagMessage : undefined,
      });
      if (flagStatus === 'flagged') {
        setFlaggedActivities(flaggedActivities.filter(id => id !== activityToFlag));
      } else {
        setFlaggedActivities([...flaggedActivities, activityToFlag]);
      }
      setFlagModalOpen(false);
      setFlagMessage('');
    } catch (error) {
      console.error('Failed to flag/unflag activity:', error);
    }
  };


  const handleDelete = (activityId) => {
    setDeleteModalOpen(true);
    setActivityToDelete(activityId);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/delete/${activityToDelete}`);
      if (response.data.success) {
        const updatedActivityList = activityList.filter(activity => activity._id !== activityToDelete);
        setActivityList(updatedActivityList);
        setDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  useEffect(() => {
    fetchActivityList();
    fetchFlaggedActivities();
  }, []);

  const fetchFlaggedActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/flagged');
      const flaggedItems = response.data.map(item => item.contentId);
      setFlaggedActivities(flaggedItems);
    } catch (error) {
      console.error('Error fetching flagged activities:', error);
    }
  };

  const fetchActivityList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/activity');
      setActivityList(response.data);
    } catch (error) {
      console.error('Error fetching activity list:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    setSelectedCategories(prevSelected => 
      prevSelected.includes(category) 
        ? prevSelected.filter(cat => cat !== category) 
        : [...prevSelected, category]
    );
  };

  const handleFilterClick = () => {
    setFilterModalOpen(true);
  };

  const handleCloseModal = () => {
    setFilterModalOpen(false);
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
    { path: '/profile', label: 'PROFILE', }
  ];

  const categories = ['class', 'kuliyyah', 'donation', 'donation report', 'service', 'product'];

  const filteredActivities = activityList.filter(activity =>
    (activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategories.length === 0 || selectedCategories.includes(activity.category))
  );

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  return (
    <>
      <GlobalStyle />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box sx={{ width: 225, bgcolor: '#4169E1', p: 0, height:'100vh', position:'fixed' }}>


          
          {/* <List>
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
          </List> */}
          <SidebarNavigation/>

        </Box>
        <Box sx={{ flexGrow: 1, p: 3 , marginLeft:'225px'}}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ flexGrow: 1}}>Content</Typography>
              <Button variant="contained" sx={{ bgcolor: 'green' }} onClick={() => navigate('/addactivity')}>Add New</Button>
              <Box sx={{ ml: 2 }}>
                <TextField
                  label="Search anything here"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  
                />
              </Box>
              <Button variant="contained" onClick={handleFilterClick}>Filter</Button>
            </Box>
            <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
              {filteredActivities.length === 0 ? (
                <Typography variant="h6">No activity yet</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: 'black', color: 'white', padding: '10px', borderBottom: '10px solid white' }}>Title</TableCell>
                      <TableCell sx={{ backgroundColor: 'black', color: 'white', padding: '10px', borderBottom: '10px solid white', textAlign: 'center' }}>Category</TableCell>
                      <TableCell sx={{ backgroundColor: 'black', color: 'white', padding: '10px', borderBottom: '10px solid white', textAlign: 'center' }}>Created On</TableCell>
                      <TableCell sx={{ backgroundColor: 'black', color: 'white', padding: '10px', borderBottom: '10px solid white', textAlign: 'center' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity._id}>
                        <TableCell onClick={() => handleTitleClick(activity)} sx={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                          <Typography variant="body2" noWrap>
                            {activity.title}
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>{activity.category}</TableCell>
                        <TableCell align="center">{new Date(activity.datetime).toLocaleDateString('en-US', { timeZone: 'Asia/Singapore' })}</TableCell>
                        <TableCell align="center">
                          <Button component={Link} to={`/edit/${activity._id}`} aria-label="edit" sx={{ bgcolor: 'green', color: 'white', mr: 1 }}>
                            Edit
                          </Button>
  <Button
    aria-label={flaggedActivities.includes(activity._id) ? 'unflag' : 'flag'}
    onClick={() => handleFlagClick(activity._id, flaggedActivities.includes(activity._id) ? 'flagged' : 'unflagged')}
    sx={{ bgcolor: flaggedActivities.includes(activity._id) ? 'red' : 'yellow', color: 'black', mr: 1 }}
  >
    {flaggedActivities.includes(activity._id) ? 'Unflag' : 'Flag'}
  </Button>

                          <Button aria-label="delete" onClick={() => handleDelete(activity._id)} sx={{ bgcolor: 'red', color: 'white' }}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Box>
          {/* Modal for delete confirmation */}
          <Modal
            open={isDeleteModalOpen}
            onClose={handleCancelDelete}
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <Box sx={{ width: 400, bgcolor: 'white', p: 4, mx: 'auto', my: '10%', borderRadius: 1 }}>
              <Typography id="delete-modal-title" variant="h6" component="h2">
                Are you sure you want to delete this activity?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" onClick={handleCancelDelete}>Cancel</Button>
                <Button variant="contained" onClick={handleConfirmDelete} sx={{ ml: 2 }} color="error">
                  Delete
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Modal for flag message */}
          <Modal
      open={isFlagModalOpen}
      onClose={() => setFlagModalOpen(false)}
      aria-labelledby="flag-modal-title"
      aria-describedby="flag-modal-description"
    >
      <Box sx={{ width: 400, bgcolor: 'white', p: 4, mx: 'auto', my: '10%', borderRadius: 1 }}>
        <Typography id="flag-modal-title" variant="h6" component="h2">
          {flagStatus === 'flagged' ? 'Unflag Activity' : 'Flag Activity'}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Enter your message"
          value={flagMessage}
          onChange={(e) => setFlagMessage(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={() => setFlagModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmFlag} sx={{ ml: 2 }} color="warning">
            {flagStatus === 'flagged' ? 'Unflag' : 'Flag'}
          </Button>
        </Box>
      </Box>
    </Modal>
        </Box>
      </Box>

      <Modal
        open={isFilterModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
      >
        <Box sx={{ width: 400, bgcolor: 'white', p: 4, mx: 'auto', my: '10%', borderRadius: 1 }}>
          <Typography id="filter-modal-title" variant="h6" component="h2">
            Filter by Category
          </Typography>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox 
                    checked={selectedCategories.includes(category)} 
                    onChange={handleCategoryChange} 
                    name={category} 
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handleCloseModal}>Apply</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
