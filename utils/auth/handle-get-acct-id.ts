import axios from "axios";

export const handleGetAccountId = async (): Promise<string | null> => {
  try {
    const response = await axios.get("/api/auth/get-acct-id");
    if (response.status === 200) {
      return response.data.acctId;
    } else {
      console.log("Failed to fetch account ID, status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching account ID:", error);
    return null;
  }
};
