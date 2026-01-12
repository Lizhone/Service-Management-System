import client from "./client";

export const saveInspection = (jobCardId, payload) => {
  return client.post(`/job-cards/${jobCardId}/inspection`, payload);
};

export const getInspection = (jobCardId) => {
  return client.get(`/job-cards/${jobCardId}/inspection`);
};
