import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";

export const deleteBlockThunk = createAsyncThunk(
  "blocks/delete",
  async (params: { sessId: string; spaceId: number; blockId: number }) => {
    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/spaces/${params.spaceId}/blocks/${params.blockId}`;

    const response = await axios.delete(endpoint, {
      headers: {
        "x-session-id": params.sessId,
      },
    });

    return params.blockId;
  },
);
