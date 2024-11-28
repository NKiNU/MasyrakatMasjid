import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Signup';
import Home from './test/Home';
import HomeMM from './HomeMM';
import PrayerTimes from './prayerTime';
import ActivityPage from './ActivityPage';
import AddActivityPage from './AddActivity';
import Actdetail from './ActdetailPage';
import KuliyyahPage from './Ilmu/Kuliyyah'; 
import ClassPage from './Ilmu/ClassPage'
import Classdetail  from './Ilmu/ClassDetailPage'
import InboxPage from './inbox'; 
import InboxDetailPage from './inboxDetail';
import VideoUpload from './KuliyyahVideos';
import GoogleCalendar from './GoogleCalendar';
import EditActivityPage from './EditContent'; 
import KuliyyahDetailPage from './Ilmu/KuliyyahDetailPage';// Import the Inbox component

function App() {
    return (
        
        <Router>
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/home' element={<Home />} />
                <Route path='/homeMM' element={<HomeMM/>} />
                <Route path='/prayerTime' element={<PrayerTimes/>} />
                <Route path='/activity' element={<ActivityPage/>}/>
                <Route path='/addactivity' element={<AddActivityPage/>}/>
                <Route path='/actdetail/:id' element={<Actdetail/>} />
                <Route path='/kuliyyah' element={<KuliyyahPage/>} />
                <Route path='/class' element={<ClassPage/>} />
                <Route path='/kuliyyah/:id' element={<KuliyyahDetailPage/>} />
                <Route path='/class/:id' element={<Classdetail/>} />
                <Route path='/inbox' element={<InboxPage/>}/>
                <Route path='/inbox/:id' element={<InboxDetailPage/>}/>
                <Route path='/videoUpload' element={<VideoUpload/>}/>
                <Route path='/calendar' element={<GoogleCalendar/>}/>
                <Route path='/edit/:id' element={<EditActivityPage/>}/>
                





            </Routes>
        </Router>

    )
}
export default App;
