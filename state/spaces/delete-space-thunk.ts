import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export const deleteSpace = createAsyncThunk(
  "spaces/deleteSpace",
  async (spaceId: number) => {
    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/spaces/${spaceId}`;
    const accountId = await handleGetAccountId();
    const sessId = await handleGetSessionID();

    if (accountId === null || sessId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    await axios.delete(endpoint, {
      params: { account_id: accountId },
      headers: { "x-session-id": sessId },
    });
  },
);
