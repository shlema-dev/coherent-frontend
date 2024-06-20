// update-space-thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export const updateSpaceName = createAsyncThunk(
  "individualSpace/updateSpaceName",
  async ({ spaceId, newName }: { spaceId: number; newName: string }) => {
    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/spaces/${spaceId}`;
    const accountId = await handleGetAccountId();
    const sessId = await handleGetSessionID();

    if (accountId === null || sessId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    const body = {
      account_id: accountId,
      name: newName,
    };

    const response = await axios.put(endpoint, body, {
      headers: {
        "x-session-id": sessId,
      },
    });

    return response.data;
  },
);
