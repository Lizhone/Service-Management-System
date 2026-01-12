import client from "./client";

export const createJobCard = (payload) => {
  console.log("API layer received:", payload);
  return client.post("/job-cards", payload);
};
export const getJobCard = (id) => {
    return client.get(`/job-cards/${id}`);

}
export const addInspection = (jobCardId, payload) => {
  return client.post(`/job-cards/${jobCardId}/inspections`, payload);
};
