import { saveComplaint } from "../api/serviceComplaints";

export const useServiceComplaints = () => {
  const submitComplaint = async (jobCardId, payload) => {
    return await saveComplaint(jobCardId, payload);
  };

  return { submitComplaint };
};
