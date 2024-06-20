import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "@/app/config";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export const getQuestionThunk = createAsyncThunk(
  "questions/get",
  async (params: { questionId: number }) => {
    const apiUrl = getApiUrl();
    const sessId = await handleGetSessionID();

    if (sessId === null) {
      throw new Error("Failed to fetch account ID or session ID");
    }

    const endpoint = `${apiUrl}/questions/${params.questionId}`;

    const response = await axios.get(endpoint, {
      headers: {
        "x-session-id": sessId,
      },
    });

    return response.data.question;
  },
);
