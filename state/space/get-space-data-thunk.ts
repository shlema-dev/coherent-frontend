import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export const getSpaceData = createAsyncThunk(
  "space/getSpaceData",
  async (spaceId: number) => {
    const apiUrl = getApiUrl();
    const accountId = await handleGetAccountId();
    const sessId = await handleGetSessionID();

    if (accountId === null || sessId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    const endpoint = `${apiUrl}/spaces/${spaceId}`;

    const response = await axios.get(endpoint, {
      params: {
        account_id: accountId,
      },
      headers: {
        "x-session-id": sessId,
      },
    });

    return response.data.space;
  },
);
