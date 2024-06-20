import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

// Define a type that aligns with what's expected in your slice
type BlockStatus = "idle" | "Running" | "Completed" | "failed";

export const getBlockStatusThunk = createAsyncThunk(
  "blocks/getBlockStatus",
  async (
    {
      executionId,
      actionType,
    }: { executionId: string; actionType: "ask" | "update" },
    { dispatch },
  ) => {
    const apiUrl = getApiUrl();
    const sessId = await handleGetSessionID();

    if (sessId === null) {
      throw new Error("Failed to fetch session ID");
    }

    const endpoint = `${apiUrl}/executions/${executionId}/status`;

    let status: BlockStatus | null = null;

    return new Promise<{
      status: BlockStatus | null;
      actionType: "ask" | "update";
    }>((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              "x-session-id": sessId,
            },
          });

          if (response.status === 200 && response.data.status === "Running") {
            status = "Running";
            console.log("Question status:", response.data);
          } else if (response.data.status === "Completed") {
            status = "Completed";
            clearInterval(intervalId);
            resolve({ status, actionType });
            console.log("Block status completed.");
          } else {
            status = "failed"; // Update to use one of the expected types from your slice
            clearInterval(intervalId);
            resolve({ status, actionType });
            console.log("Block status:", response.data.status);
          }
        } catch (error: any) {
          console.error("Error getting block status:", error);
          clearInterval(intervalId);
          reject(error);
        }
      }, 3000);
    });
  },
);
