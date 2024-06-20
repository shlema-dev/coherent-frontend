import axios from "axios";

export const handleGetSessionID = async (): Promise<string | null> => {
  try {
    const response = await axios.get("/api/auth/get-sess-id");
    if (response.status === 200) {
      return response.data.sessid;
    } else {
      console.log("Failed to fetch session ID, status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching session ID:", error);
    return null;
  }
};
