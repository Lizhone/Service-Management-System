import client from "./client";

export const saveComplaint = (jobCardId, payload) => {
  return client.post(`/api/job-cards/${jobCardId}/complaints`, payload);
};