import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (token) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      auth: { token }, // Send the JWT token
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return socket;
};

export default useSocket;
