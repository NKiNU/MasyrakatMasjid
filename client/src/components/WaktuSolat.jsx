import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrayerTimes = ({ setPrayerTimes }) => {
  const [zone, setZone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZoneAndPrayerTimes = async (lat, long) => {
      try {
        const gpsResponse = await axios.get('https://api.waktusolat.app/zones/gps', {
          params: { lat, long }
        });
        const { zone } = gpsResponse.data;
        setZone(zone);

        const solatResponse = await axios.get(`https://api.waktusolat.app/v2/solat/${zone}`);
        const today = new Date().getDate();
        const todayPrayerTimes = solatResponse.data.prayers.find(prayer => prayer.day === today);
        setPrayerTimes(todayPrayerTimes);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchZoneAndPrayerTimes(latitude, longitude);
          },
          (error) => {
            setError('Unable to retrieve your location');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default PrayerTimes;
