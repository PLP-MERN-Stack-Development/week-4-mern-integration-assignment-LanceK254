import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null, optimisticUpdate = null) => {
    setLoading(true);
    setError(null);

    const useApi = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null, optimisticUpdate = null) => {
    setLoading(true);
    setError(null);

    let previousData = null;
    if (optimisticUpdate) {
      previousData = optimisticUpdate();
    }

    try {
      const headers = user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
      const response = await axios({ method, url, data, headers });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
      if (optimisticUpdate && previousData) {
        optimisticUpdate(previousData);
      }
      throw err;
    }
  }, [user]);

  return { loading, error, request };
};
    
    // Execute optimistic update if provided
    let previousData = null;
    if (optimisticUpdate) {
      previousData = optimisticUpdate();
    }

    try {
      const response = await axios({ method, url, data });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
      // Revert optimistic update on error
      if (optimisticUpdate && previousData) {
        optimisticUpdate(previousData);
      }
      throw err;
    }
  }, []);

  return { loading, error, request };
};

export default useApi;