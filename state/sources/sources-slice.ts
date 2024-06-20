import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSourceThunk } from "./create-source-thunk";
import { getAccountDataSources } from "./get-account-sources-thunk";

interface CreatedSource {
  data_source_id: number;
}

interface FetchedSource {
  id: number;
  account_id: string;
  name: string;
  type: string;
  credentials: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface SourcesState {
  fetchedSources: FetchedSource[] | null;
  createdSources: CreatedSource[] | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: SourcesState = {
  fetchedSources: null,
  createdSources: null,
  status: "idle",
  error: null,
};

export const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSourceThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createSourceThunk.fulfilled,
        (state, action: PayloadAction<CreatedSource>) => {
          state.status = "idle";
          if (state.createdSources) {
            state.createdSources.push(action.payload);
          } else {
            state.createdSources = [action.payload];
          }
        },
      )
      .addCase(createSourceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create source";
      })
      .addCase(getAccountDataSources.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getAccountDataSources.fulfilled,
        (state, action: PayloadAction<{ data_sources: FetchedSource[] }>) => {
          state.status = "idle";
          state.fetchedSources = action.payload.data_sources;
        },
      )
      .addCase(getAccountDataSources.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch data sources";
      });
  },
});

export default sourcesSlice.reducer;
