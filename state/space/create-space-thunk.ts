// create-space-thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export const createSpace = createAsyncThunk(
  "individualSpace/createSpace",
  async (spaceName: string) => {
    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/spaces`;
    const accountId = await handleGetAccountId();
    const sessId = await handleGetSessionID();

    if (accountId === null || sessId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    const body = {
      account_id: accountId,
      name: spaceName,
    };

    const response = await axios.post(endpoint, body, {
      headers: {
        "x-session-id": sessId,
      },
    });

    const spaceId = response.data.space_id;

    return spaceId;
  },
);
