import { useEffect, useState } from 'react';
import client from '../api/client';

export const useJobCards = (filters = {}) => {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await client.get('/job-cards/search', { params: filters });
      setJobCards(res.data);
      setLoading(false);
    };

    fetch();
  }, [JSON.stringify(filters)]);

  return { jobCards, loading };
};
