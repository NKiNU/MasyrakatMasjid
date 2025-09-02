import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { newsService } from '../api/newsApi';
import { videoService } from '../api/videoApi';
import donateapi from '../api/donateApi';
import { useAuth } from '../context/AuthContext';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, ArrowRight, Video, Heart } from 'lucide-react';
import { Search, Flag, Edit, Trash2, ChevronRight, Plus, Loader2, X } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import PrayerTimes from '../components/WaktuSolat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import axios from 'axios';


export default function HomeMM() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentMainSlide, setCurrentMainSlide] = useState(0);
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [videos, setVideos] = useState([]);
  const [donations, setDonations] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // const videoItems = [
  //   {
  //     thumbnail: "/api/placeholder/400/225",
  //     title: "Understanding Quran",
  //     duration: "45:00"
  //   },
  //   {
  //     thumbnail: "/api/placeholder/400/225",
  //     title: "Daily Prayers Guide",
  //     duration: "30:00"
  //   },
  //   {
  //     thumbnail: "/api/placeholder/400/225",
  //     title: "Islamic History",
  //     duration: "60:00"
  //   }
  // ];

  // const donationItems = [
  //   {
  //     title: "Masjid Renovation",
  //     target: "50,000",
  //     current: "35,000",
  //     image: "/api/placeholder/400/200"
  //   },
  //   {
  //     title: "Education Fund",
  //     target: "25,000",
  //     current: "15,000",
  //     image: "/api/placeholder/400/200"
  //   }
  // ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsService.getFeaturedNews();
        setNewsItems(response);
        console.log(response)
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };
    fetchNews();
  }, []);

    // Fetch videos and donations on component mount
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch recent videos
          const videosData = await videoService.getAllVideos();

          console.log(videosData);
          setVideos(videosData);
  
          // Fetch active donations
          const donationsResponse = await donateapi.get('/donations');
          console.log(donationsResponse)
          setDonations(donationsResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const nextMainSlide = () => {
    setCurrentMainSlide((prev) => 
      prev === newsItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevMainSlide = () => {
    setCurrentMainSlide((prev) => 
      prev === 0 ? newsItems.length - 1 : prev - 1
    );
  };

  const nextVideoSlide = () => {
    setCurrentVideoSlide((prev) => 
      prev === videos.length - 1 ? 0 : prev + 1
    );
  };

  const prevVideoSlide = () => {
    setCurrentVideoSlide((prev) => 
      prev === 0 ? videos.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextMainSlide, 5000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  const handleNewsClick = () => {
    const currentNews = newsItems[currentMainSlide];
    if (currentNews) {
      navigate(`/news/${currentNews._id}`);
    }
  };
  const handleVideoClick = (videoId) => {
    navigate(`/Islamic-videos/${videoId}`);
  };

  const handleDonateClick = (donationId) => {
    navigate(`/donation`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <SidebarNavigation/>
      <MainLayout >
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: "auto", flexGrow: 1, p: 3 }}>
          <PrayerTimes setPrayerTimes={setPrayerTimes} />
          <div className="grid grid-cols-6 gap-4 my-4">
            {["Hijri", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
              (timeKey, index) => (
                <div
                  key={index}
                  className="bg-blue-300 p-4 rounded-md text-center"
                >
                  <h6 className="text-lg font-bold">{timeKey}</h6>
                  <p className="text-sm">
                    {prayerTimes
                      ? timeKey === "Hijri"
                        ? prayerTimes.hijri
                        : formatTime(prayerTimes[timeKey.toLowerCase()])
                      : ""}
                  </p>
                </div>
              )
            )}
          </div>

          {/* News Carousel Section */}
          <Card className="relative overflow-hidden mb-6">
            <div className="relative h-[400px]">
              {newsItems.map((news, index) => (
                <div
                  key={news._id}
                  
                  className={`absolute w-full h-full transition-opacity duration-500 cursor-pointer ${
                    currentMainSlide === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={() => handleNewsClick()}
                >
                  <img
                    src={news.images?.[0] || "/api/placeholder/800/400"}
                    alt={news.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <h2 className="text-2xl font-bold">{news.title}</h2>
                    <p className="mt-2">{news.content.substring(0, 150)}...</p>
                    <p className="mt-2 text-sm opacity-75">
                      {new Date(news.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {/* Updated navigation buttons */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevMainSlide();
                  }}
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextMainSlide();
                  }}
                >
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
              {/* Added slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {newsItems.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentMainSlide === index ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMainSlide(index);
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Lower Section - Split into Two Columns */}
          <div className="grid grid-cols-2 gap-6">

            {/* Video Section */}
            <Card className="bg-slate-100">
              <CardHeader >
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Available Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="overflow-hidden">
                    <div className="flex transition-transform duration-300" 
                         style={{ transform: `translateX(-${currentVideoSlide * 100}%)` }}>
                      {videos.map((video, index) => (
                        <div 
                          key={video._id} 
                          className="min-w-full p-2 cursor-pointer"
                          onClick={() => handleVideoClick(video._id)}
                        >
                          <div className="relative rounded-lg overflow-hidden">
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full object-cover aspect-video"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-medium">Click to Watch</span>
                            </div>
                          </div>
                          <h3 className="mt-2 font-medium">{video.title}</h3>
                          <p className="text-sm text-gray-600">{video.speaker}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <span>{video.views} views</span>
                            <span>•</span>
                            <span>{video.likes} likes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {videos.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      <button
                        className="bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-all"
                        onClick={prevVideoSlide}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        className="bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-all"
                        onClick={nextVideoSlide}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Donation Section */}
            <Card className="bg-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Active Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div 
                      key={donation._id} 
                      className="space-y-3 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleDonateClick(donation._id)}
                    >
                      {/* <img
                        src={donation.imageUrl || "/api/placeholder/400/200"}
                        alt={donation.title}
                        className="w-full rounded-lg object-cover h-48"
                      /> */}
                      <div>
                        <h3 className="font-medium">{donation.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{donation.description}</p>
                        <div className="mt-2 space-y-2">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-600 rounded-full"
                              style={{
                                width: `${(donation.currentAmount / donation.targetAmount) * 100}%`
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Current Collected Amount: RM {donation.currentAmount.toLocaleString()}</span>
                            <span>Target: RM {donation.targetAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Box>
      </MainLayout>
    </>
  );
}