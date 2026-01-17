import client from "./client";

export const createJobCard = (payload) => {
  return client.post("/job-cards", payload);
};

export const getJobCard = (id) => {
  return client.get(`/job-cards/${id}`);
};

export const searchJobCards = (q = "") => {
  return client.get("/job-cards/search", { params: { q } });
};
