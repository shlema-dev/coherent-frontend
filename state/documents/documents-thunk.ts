import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetAccountId } from "@/utils/auth/handle-get-acct-id";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export const getDocumentsThunk = createAsyncThunk(
  "document/getDocuments",
  async (spaceId: number) => {
    const apiUrl = getApiUrl();
    const accountId = await handleGetAccountId();
    const sessId = await handleGetSessionID();

    if (accountId === null || sessId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    const endpoint = `${apiUrl}/spaces/${spaceId}/documents`;

    const response = await axios.get(endpoint, {
      params: {
        account_id: accountId,
      },
      headers: {
        "x-session-id": sessId,
      },
    });

    return response.data.documents;
  },
);

export const uploadDocumentsThunk = createAsyncThunk(
  "document/uploadDocuments",
  async (payload: { fileList: File[]; sessionId: string; spaceId: string }) => {
    if (payload.sessionId === "") {
      throw new Error("Session ID is empty");
    }

    const formData = new FormData();
    payload.fileList.forEach((file) => {
      formData.append("file", file);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-session-id": payload.sessionId,
      },
    };

    const root = getApiUrl();
    const endpoint = `${root}/spaces/${payload.spaceId}/documents`;

    const response = await axios.post(endpoint, formData, config);

    return response.data;
  },
);
