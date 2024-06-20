import axios from "axios";
import router from "next/router";
import { handleGetSessionID } from "./handle-get-sess-id";

let refreshTimeoutId: NodeJS.Timeout | null = null;

export const setRefreshTimeoutId = (timeoutId: NodeJS.Timeout) => {
  if (refreshTimeoutId) {
    console.log("Clearing old refresh timer.");
    clearTimeout(refreshTimeoutId);
  }

  console.log("Setting new refresh timer.");
  refreshTimeoutId = timeoutId;
};

export const clearRefreshTimeout = () => {
  if (refreshTimeoutId) {
    console.log("Manually clearing refresh timer.");
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
};

export const startAuthRefreshTimer = async () => {
  console.log("Attempting to refresh auth token.");
  const sessionId = await handleGetSessionID();

  if (sessionId === null) {
    throw new Error("Failed to fetch account ID or session ID");
  }
  try {
    const response = await axios.post("/api/auth/auth-refresh", { sessionId });

    const { exp } = response.data;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = (exp - currentTime - 5 * 60) * 1000;
    const timeoutId = setTimeout(() => {
      console.log("Refresh timer triggered. Refreshing...");
      startAuthRefreshTimer();
    }, timeUntilExpiration);

    setRefreshTimeoutId(timeoutId);
  } catch (error) {
    console.error("Error refreshing authentication:", error);
    router.push("/auth/login");
  }
};
