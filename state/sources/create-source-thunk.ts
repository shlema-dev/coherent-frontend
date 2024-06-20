import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createSourceThunk = createAsyncThunk(
  "source/createSource",
  async (payload: {
    credentials: Record<string, any>;
    name: string;
    type: string;
  }) => {
    const root = getApiUrl();
    const endpoint = `${root}/data-sources`;
    const accountId = await handleGetAccountId();
    const sessionId = await handleGetSessionID();

    if (accountId === null || sessionId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    const body = {
      account_id: accountId,
      credentials: payload.credentials,
      name: payload.name,
      type: payload.type,
    };

    console.log("Payload for source: ", body);

    const response = await axios.post(endpoint, body, {
      headers: {
        "x-session-id": sessionId,
      },
    });

    return response.data;
  },
);
