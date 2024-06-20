import axios from "axios";
import { NextRouter } from "next/router";
import { clearRefreshTimeout } from "./handle-auth-refresh";
import { handleGetSessionID } from "./handle-get-sess-id";

export const logoutRedirect = async (router: NextRouter) => {
  const sessId = await handleGetSessionID();

  if (sessId === null) {
    throw new Error("Failed to fetch account ID or session ID");
  }

  try {
    // Clear the timeout to stop the auth refresh timer
    clearRefreshTimeout();

    await axios.post("/api/auth/logout", { sessId });
    router.push("/auth/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
