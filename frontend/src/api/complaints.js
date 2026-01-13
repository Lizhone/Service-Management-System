import axios from "axios";

export const saveComplaint = (jobCardId, payload) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `http://localhost:4000/job-cards/${jobCardId}/complaints`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
