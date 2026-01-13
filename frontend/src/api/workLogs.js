import axios from "axios";

export const fetchWorkLogs = (jobCardId) =>
  axios.get(`http://localhost:4000/job-cards/${jobCardId}/work-logs`);

export const saveWorkLog = (jobCardId, payload) =>
  axios.post(`http://localhost:4000/job-cards/${jobCardId}/work-logs`, payload);

export const completeWorkLog = (id) =>
  axios.patch(`http://localhost:4000/work-logs/${id}/complete`);
