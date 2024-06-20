import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSpaces } from "./fetch-spaces-thunk";
import { deleteSpace } from "./delete-space-thunk"; // import the deleteSpace thunk

interface ISpace {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface SpacesState {
  spaces: ISpace[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: SpacesState = {
  spaces: [],
  status: "idle",
  error: null,
};

const spacesSlice = createSlice({
  name: "spaces",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpaces.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSpaces.fulfilled,
        (state, action: PayloadAction<ISpace[]>) => {
          state.status = "idle";
          state.spaces = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchSpaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An unknown error occurred";
      })
      .addCase(deleteSpace.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSpace.fulfilled, (state, action) => {
        state.status = "idle";
        const spaceId = action.meta.arg;
        state.spaces = state.spaces.filter((space) => space.id !== spaceId);
        state.error = null;
      })
      .addCase(deleteSpace.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An unknown error occurred";
      });
  },
});

export default spacesSlice.reducer;
