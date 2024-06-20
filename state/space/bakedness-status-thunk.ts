import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { updateBakednessStatus } from "./space-slice";
import { ValueVariable } from "@carbon/icons-react";

export type BakednessStatus = "idle" | "baking" | "fullyBaked" | "failed";

export const getBakednessStatusThunk = createAsyncThunk(
  "spaces/getBakednessStatus",
  async ({ spaceId }: { spaceId: number }, { dispatch }) => {
    const apiUrl = getApiUrl();
    const sessId = await handleGetSessionID();
    const accountId = await handleGetAccountId();

    if (sessId === null || accountId == null) {
      throw new Error("Failed to fetch session ID or Account ID");
    }

    const endpoint = `${apiUrl}/spaces/${spaceId}/bakedness?account_id=${accountId}`;

    dispatch(updateBakednessStatus({ status: "baking", value: 0 }));

    return new Promise<void>((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              "x-session-id": sessId,
            },
          });

          const bakednessValue = response.data.bakedness;
          let status: BakednessStatus;

          if (response.status === 200 && bakednessValue < 100) {
            status = "baking";
          } else if (bakednessValue === 100) {
            status = "fullyBaked";
            clearInterval(intervalId);
            resolve();
          } else {
            status = "failed";
            clearInterval(intervalId);
            reject();
          }

          // Dispatch an action to update the Redux store
          console.log("Status: " + status + " Bakedness: " + bakednessValue);
          dispatch(updateBakednessStatus({ status, value: bakednessValue }));
        } catch (error: any) {
          console.error("Error getting bakedness status:", error);
          clearInterval(intervalId);
          reject(error);
        }
      }, 5000);
    });
  },
);
