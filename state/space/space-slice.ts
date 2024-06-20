// spaceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSpace } from "./create-space-thunk";
import { getSpaceData } from "./get-space-data-thunk";
import {
  BakednessStatus,
  getBakednessStatusThunk,
} from "./bakedness-status-thunk";
import { updateSpaceName } from "./update-space-thunk";

interface ISpace {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface SpaceState {
  space: ISpace | null;
  status: "idle" | "loading" | "failed";
  bakednessStatus: BakednessStatus;
  bakednessValue: number;
  context: string;
  error: string | null;
}

const initialState: SpaceState = {
  space: null,
  status: "idle",
  bakednessStatus: "idle",
  bakednessValue: 0,
  context: "",
  error: null,
};

const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {
    updateBakednessStatus: (
      state,
      action: PayloadAction<{ status: BakednessStatus; value: number }>,
    ) => {
      state.bakednessStatus = action.payload.status;
      state.bakednessValue = action.payload.value;
    },
    updateSpaceContext: (state, action: PayloadAction<{ context: string }>) => {
      state.context = action.payload.context;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Space
      .addCase(createSpace.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createSpace.fulfilled,
        (state, action: PayloadAction<ISpace>) => {
          state.status = "idle";
          state.space = action.payload;
          state.error = null;
        },
      )
      .addCase(createSpace.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An unknown error occurred";
      })

      // Update space name
      .addCase(updateSpaceName.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateSpaceName.fulfilled,
        (state, action: PayloadAction<{ name: string }>) => {
          state.status = "idle";
          if (state.space) {
            state.space.name = action.payload.name;
          }
        },
      )
      .addCase(updateSpaceName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An unknown error occurred";
      })

      // Get Space Data
      .addCase(getSpaceData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getSpaceData.fulfilled,
        (state, action: PayloadAction<ISpace>) => {
          state.status = "idle";
          state.space = action.payload;
        },
      )
      .addCase(getSpaceData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An unknown error occurred";
      })
      .addCase(getBakednessStatusThunk.pending, (state) => {
        state.bakednessStatus = "baking";
      })
      // Bakedness fulfilled state handled in thunk
      .addCase(getBakednessStatusThunk.rejected, (state) => {
        state.bakednessStatus = "failed";
      });
  },
});

export const { updateBakednessStatus } = spaceSlice.actions;
export const { updateSpaceContext } = spaceSlice.actions;
export default spaceSlice.reducer;
