import client from "./client";

export const getWorkLogs = (jobCardId) =>
  client.get(`/job-cards/${jobCardId}/work-log`);

export const addWorkLog = (jobCardId, payload) =>
  client.post(`/job-cards/${jobCardId}/work-log`, payload);
