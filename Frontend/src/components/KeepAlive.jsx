import { useEffect } from 'react';

const BACKEND_URL = "https://emotionary-api.onrender.com";

// Pings the Render backend every 10 minutes to prevent it from falling asleep
const KeepAlive = () => {
  useEffect(() => {
    const keepAlive = () => {
      fetch(`${BACKEND_URL}/health`) // Simple health check endpoint
        .then(() => console.log('Keep-alive ping sent'))
        .catch(() => console.log('Keep-alive ping failed'));
    };

    // Ping every 10 minutes (600,000 ms)
    const interval = setInterval(keepAlive, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default KeepAlive;