import { useState, useEffect } from 'react';
import client from '../api/client';

export default function useJobCards() {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobCards = async () => {
    try {
      const response = await client.get('/job-cards/search');
      setJobCards(response.data);
    } catch (error) {
      console.error('Error fetching job cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobCards();
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchJobCards();
  };

  return { jobCards, loading, refetch };
}
