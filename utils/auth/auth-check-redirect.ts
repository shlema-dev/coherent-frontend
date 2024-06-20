import axios from "axios";
import { NextRouter } from "next/router";
import { logoutRedirect } from "./logout-redirect";

export const authCheckRedirect = async (router: NextRouter) => {
  // try {
  // const response = await axios.get("/api/auth/check-auth");

  // if (!response.data.auth) {
  //   // Redirect to login or call logout function to clear cookies and redirect
  //   await logoutRedirect(router);

  return true;
  // }
  // } catch (error) {
  //   console.error("Error checking authentication:", error);
  //   router.push("/auth/login");
  // }
};
