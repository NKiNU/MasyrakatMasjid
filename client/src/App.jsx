import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Home from "./test/Home";
import HomeMM from "./early/HomeMM";
import PrayerTimes from "./components/WaktuSolat";
import ActivityPage from "./early/ActivityPage";
import AddActivityPage from "./early/AddActivity";
import Actdetail from "./early/ActdetailPage";
import KuliyyahPage from "./Ilmu/Kuliyyah";
import ClassPage from "./Ilmu/ClassPage";
import Classdetail from "./Ilmu/ClassDetailPage";
import InboxPage from "./early/inbox";
import InboxDetailPage from "./early/inboxDetail";
import VideoUpload from "./early/KuliyyahVideos";
import GoogleCalendar from "./early/GoogleCalendar";
import EditActivityPage from "./early/EditContent";
import KuliyyahDetailPage from "./Ilmu/KuliyyahDetailPage";
import ProductPage from "./pages/productPage";
import AdminProductPage from "./pages/AdminProductPage";
import AddProduct from "./pages/AddProduct";
import DonationAdmin from "./components/Donations/DonationsAdmin";
import DonationPage from "./pages/DonationPage";
import { AuthProvider } from "./context/AuthContext"; // Import the Inbox component
import SchedulePage from "./pages/SchedulePage";
import NewInboxPage from "./pages/InboxPage";
import PaymentPage from "./pages/PaymentPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./components/PageNotFound";
import ServiceForm from "./components/Service/ServiceForm";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ViewProfile from "./components/Profile/ProfileView";
import EditProfile from "./components/Profile/EditProfile";
import WeeklyCalendar from "./components/Schedule/EventCalendar";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import CartPage from "./pages/CartPage";
import ServiceList from "./components/Service/ServiceList";
import ServiceBooking from "./components/Service/RequestForm";
import AvailabilityManagement from "./components/Service/AvailabilityManagement";
import BookingManagement from "./components/Service/ManageRequest";
import AddClass from "./components/Class/AddClass";
import ClassList from "./components/Class/ClassList";
import ClassDetail from "./components/Class/ClassDetail";
import AddIslamicVideo from "./components/Lecture/AddIslamicVideo";
import IslamicVideoList from "./components/Lecture/IslamicVideoList";
import IslamicVideoDetails from "./components/Lecture/IslamicVideoDetails";
import Calendar from "./components/Schedule/TestCalendar";
import NewsList from "./components/News/NewsList";
import NewsDetails from "./components/News/NewsDetails";
import AddNews from "./components/News/AddNews";
import EducationSection from "./pages/ClassPage";
import NotificationPage from "./components/Notification";
import EventCalendar from "./pages/EventCalendar";
// import ContentList from "./components/Activity/ContentList";
import CommunicationSection from "./pages/CommunicationPage";

import ContentList from "./components/Activity/ContentList";
import ProductList from "./components/Products/ProductList";
import ProductForm from "./components/Products/ProductForm";
import NewDonationPage from "./pages/NewDonationPage";
function App(keycloak) {
  console.log("email",keycloak?.tokenParsed?.email || 'No email found')
  console.log("keycloak",keycloak)
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup/:role" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/homeMM" element={<HomeMM />} />
            <Route path="/prayerTime" element={<PrayerTimes />} />
            <Route path="/activity" element={<ContentList />} />
            <Route path="/addactivity" element={<AddActivityPage />} />
            <Route path="/actdetail/:id" element={<Actdetail />} />

            
            {/* <Route path="/kuliyyah" element={<KuliyyahPage />} /> */}
            <Route path="/kuliyyah" element={<EducationSection />} />


            <Route path="/kuliyyah/class" element={<ClassPage />} />
            <Route path="/kuliyyah/:id" element={<KuliyyahDetailPage />} />
            <Route path="/class/:id" element={<Classdetail />} />
            {/* <Route path="/inbox" element={<InboxPage />} /> */}
            <Route path="/inbox/:id" element={<InboxDetailPage />} />
            <Route path="/videoUpload" element={<VideoUpload />} />
            {/* <Route path="/calendar" element={<GoogleCalendar />} /> */}
            <Route path="/edit/:id" element={<EditActivityPage />} />
            <Route path="service/shop" element={<ProductList />} />
            <Route path="/adminShop" element={<AdminProductPage />} />
            <Route path="/products/add" element={<ProductForm mode="add" />} />
            <Route
              path="/service/manageRequest"
              element={<BookingManagement />}
            />
            <Route
              path="/products/edit/:id"
              element={<ProductForm mode="edit" />}
            />
            <Route path="/donationAdmin" element={<DonationAdmin />} />
            <Route path="/donation" element={<DonationPage />} />
            <Route path="/createEvent" element={<SchedulePage />} />
            <Route path="/newInbox" element={<NewInboxPage />} />
            <Route path="/payment-gateway" element={<PaymentPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* <Route path='/profile' element={<ProfilePage/>}/>    */}


            <Route path="/profile" element={<ViewProfile />} />
            <Route path="/profile/edit/:id" element={<EditProfile />} />
            <Route path="/profile/:id" element={<ViewProfile />} />
            <Route path="/profile/new" element={<ViewProfile />} />


            <Route path="/chat" element={<CommunicationSection />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/error" element={<NotFoundPage />} />
            <Route path="/service/services" element={<ServiceList/>} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/service/cart" element={<CartPage />} />
            <Route path="/service/new" element={<ServiceForm />} />
            
            <Route path="/service/edit/:id" element={<ServiceForm />} />
            <Route path="/service/book/:serviceId" element={<ServiceBooking />} />
            <Route path="/service/availability/:id" element={<AvailabilityManagement/>}/>

            <Route path="/calendargoogle" element={<WeeklyCalendar />} />

            <Route path="/kuliyyah/addClass" element={<AddClass/>}/>
            <Route path="/kuliyyah/editClass/:id" element={<AddClass/>}/>
            <Route path="/classes" element={<ClassList/>}/>
            <Route path="/kuliyyah/classes/:id" element={<ClassDetail/>}/>

            <Route path="/addVideo" element={<AddIslamicVideo/>}/>
            <Route path="/IslamicVideo" element={<IslamicVideoList/>}/>
            <Route path="/Islamic-videos/:id" element={<IslamicVideoDetails/>}/>

            <Route path="/trates" element={<Calendar/>}/>
            <Route path="/calendar" element={<EventCalendar/>}/>

            <Route path="/news" element={<NewsList/>}/>
            <Route path="/news/edit/:id" element={<AddNews/>}/>
            <Route path="/news/add" element={<AddNews/>}/>
            <Route path="/news/:id" element={<NewsDetails/>}/>

            <Route path="/inbox" element={<NotificationPage/>}/>

            <Route path="/newpage" element={<NewDonationPage/>}/>
            {/* <Route path="/activities" element={<ContentList/>}/> */}
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
export default App;
