import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

const performBlockAction = async (params: {
  spaceId: number;
  name: string;
  prompt: string;
  type: string;
  scope: string;
  parentId: number;
  operation: "ask" | "update";
}) => {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/spaces/${params.spaceId}/blocks`;
  const accountId = await handleGetAccountId();
  const sessionId = await handleGetSessionID();

  if (accountId === null || sessionId === null) {
    throw new Error("Failed to fetch account ID or session ID");
  }

  const body = {
    account_id: accountId,
    name: params.name,
    prompt: params.prompt,
    type: params.type,
    scope: params.scope,
    parent_id: params.parentId,
  };

  console.log("Question being asked: ", params.prompt);

  return await axios.post(endpoint, body, {
    headers: {
      "x-session-id": sessionId,
    },
  });
};

export const askBlockThunk = createAsyncThunk(
  "blocks/ask",
  async (params: {
    spaceId: number;
    name: string;
    prompt: string;
    type: string;
    scope: string;
    parentId: number;
  }) => {
    const response = await performBlockAction({ ...params, operation: "ask" });
    console.log("Ask Block Response: ", response.data);
    return response.data;
  },
);

export const updateBlockThunk = createAsyncThunk(
  "blocks/update",
  async (params: {
    spaceId: number;
    name: string;
    prompt: string;
    type: string;
    scope: string;
    parentId: number;
  }) => {
    const response = await performBlockAction({
      ...params,
      operation: "update",
    });
    console.log("Update Block Response: ", response.data);
    return response.data;
  },
);
