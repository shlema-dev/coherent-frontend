import axios from "axios";

export const isUserAuthed = async (): Promise<boolean> => {
  try {
    const response = await axios.get("/api/auth/check-auth");
    return response.data.auth;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};
