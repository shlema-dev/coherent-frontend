// documentSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getDocumentsThunk, uploadDocumentsThunk } from "./documents-thunk";

interface DocumentData {
  account_id: string;
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
  uri: string;
}

interface DocumentsState {
  documents: DocumentData[] | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: DocumentsState = {
  documents: null,
  status: "idle",
  error: null,
};

export const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDocumentsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDocumentsThunk.fulfilled, (state, action) => {
        state.status = "idle";
        state.documents = action.payload;
      })
      .addCase(getDocumentsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load documents";
      })
      .addCase(uploadDocumentsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadDocumentsThunk.fulfilled, (state, action) => {
        state.status = "idle";
        if (state.documents) {
          state.documents.push(...action.payload);
        } else {
          state.documents = action.payload;
        }
      })
      .addCase(uploadDocumentsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to upload documents";
      });
  },
});

export default documentsSlice.reducer;
