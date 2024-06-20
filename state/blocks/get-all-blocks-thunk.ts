import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export interface BlockData {
  id: number;
  space_id: number;
  name: string;
  prompt: string;
  type: string;
  scope: string;
  bakedness: number;
  parent_id: number;
  content: string;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const getAllBlocksThunk = createAsyncThunk(
  "blocks/getAll",
  async (spaceId: number) => {
    const apiUrl = getApiUrl();
    const accountId = await handleGetAccountId();
    const sessionId = await handleGetSessionID();

    if (accountId === null || sessionId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    const endpoint = `${apiUrl}/spaces/${spaceId}/blocks`;
    let blocks: BlockData[] = [];

    try {
      const response = await axios.get(endpoint, {
        params: {
          account_id: accountId,
        },
        headers: {
          "x-session-id": sessionId,
        },
      });

      if (!response.data.blocks) {
        return [];
      }

      blocks = response.data.blocks;

      // Sort the blocks here
      blocks.sort((a, b) => {
        const aId = a.parent_id !== 0 ? a.parent_id : a.id;
        const bId = b.parent_id !== 0 ? b.parent_id : b.id;
        return aId - bId;
      });

      console.log("Sorted blocks: ", blocks);
      return blocks;
    } catch (error: any) {
      if (error.response) {
        console.log("Response Data:", error.response.data);
        console.log("Response Status:", error.response.status);
        console.log("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.log("Request:", error.request);
      } else {
        console.log("Error:", error.message);
      }
      console.log("Error Config:", error.config);
    }

    return [];
  },
);
