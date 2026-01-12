import { createJobCard } from "../api/jobCards";

export const useJobCards = () => {
  const create = async (payload) => {
    console.log("Hook layer received:", payload);
    const res = await createJobCard(payload);
    return res.data;
  };

  return { create };
};
