import { NextRouter } from "next/router";
import {
  setRefreshTimeoutId,
  startAuthRefreshTimer,
} from "./handle-auth-refresh";
import axios from "axios";

export const handleLogin = async (router: NextRouter) => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessid = urlParams.get("sessid");
  const acctId = urlParams.get("acct");
  const refresh = urlParams.get("refresh");
  const exp = urlParams.get("exp");

  console.log(sessid);
  console.log(acctId);
  console.log(refresh);
  console.log(exp);

  if (sessid && acctId && refresh && exp) {
    try {
      const response = await axios.post("/api/auth/login", {
        sessid,
        acctId,
        refresh,
        exp,
      });

      if (response.data.message === "Success") {
        // Calculate time until token expiration and set refresh timer
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiration =
          (parseInt(exp) - currentTime - 5 * 60) * 1000;
        const timeoutId = setTimeout(
          () => startAuthRefreshTimer(),
          timeUntilExpiration,
        );
        setRefreshTimeoutId(timeoutId);

        router.push("/");
      } else {
        router.push("/auth/login");
        console.log("Failed to store session ID:", response.data.message);
      }
    } catch (error) {
      router.push("/auth/login");
      console.error("Error during session ID handling:", error);
    }
  }
};
