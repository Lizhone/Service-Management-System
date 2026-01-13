import api from "./client";

export const fetchParts = (jobCardId) =>
  api.get(`/job-cards/${jobCardId}/parts`);

export const saveParts = (jobCardId, parts) =>
  api.post(`/job-cards/${jobCardId}/parts`, parts);
