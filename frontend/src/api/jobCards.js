import client from './client';

export const createJobCard = (data) => client.post('/job-cards', data);
