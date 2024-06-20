import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export const fetchSpaces = createAsyncThunk("spaces/fetchSpaces", async () => {
  const apiUrl = getApiUrl();
  const accountId = await handleGetAccountId();
  const sessId = await handleGetSessionID();

  if (accountId === null || sessId === null) {
    throw new Error("Failed to fetch account ID or session ID");
  }

  const endpoint = `${apiUrl}/accounts/${accountId}/spaces`;

  const response = await axios.get(endpoint, {
    headers: {
      "x-session-id": sessId,
    },
  });

  //return response.data.spaces;
  return [];
});
