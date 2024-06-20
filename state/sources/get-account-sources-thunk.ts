import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAccountDataSources = createAsyncThunk(
  "source/getAccountDataSources",
  async () => {
    const root = getApiUrl();
    const endpoint = `${root}/data-sources`;
    const accountId = await handleGetAccountId();
    const sessionId = await handleGetSessionID();

    if (accountId === null || sessionId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    const params = {
      account_id: accountId,
    };

    console.log("Fetching data sources for account: ", accountId);

    const response = await axios.get(endpoint, {
      params: params,
      headers: {
        "x-session-id": sessionId,
      },
    });

    return response.data;
  },
);
