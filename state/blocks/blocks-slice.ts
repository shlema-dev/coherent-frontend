import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { deleteBlockThunk } from "./delete-block-thunk";
import { getQuestionThunk } from "./get-question-thunk";
import { getBlockStatusThunk } from "./block-status-thunk";
import { getAllBlocksThunk } from "./get-all-blocks-thunk";
import { askBlockThunk, updateBlockThunk } from "./ask-block-thunk";

export type BlockStatus = "idle" | "Running" | "Completed" | "failed";
type EditBlockStatus = Record<number, BlockStatus>;

interface CustomThunkArg {
  executionId: string;
  actionType: "ask" | "update";
}

export interface AnswerData {
  answer: string;
  created_at: string;
  data_type: string;
  id: number;
  question_id: number;
  tags: string[];
  updated_at: string;
}

export interface QuestionData {
  id: number;
  account_id: string;
  question: string;
  answers: AnswerData[];
  created_at: string;
  updated_at: string;
}

interface BlockData {
  id: number;
  parent_id: number;
  space_id: number;
  name: string;
  prompt: string;
  type: string;
  scope: string;
  bakedness: number;
  content: string;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface BlocksState {
  questions: QuestionData[];
  blocks: BlockData[];
  currentExecutionId: string | null;
  currentBlockId: string | null;
  currentParentId: number;
  initialSpaceId: number | null;
  currentSpaceId: number | null;
  shouldUpdateBlocks: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  blockStatus: "idle" | "Running" | "Completed" | "failed";
  isAnyEditBlockRunning: boolean;
  editBlockStatus: Record<number, "idle" | "Running" | "Completed" | "failed">;
  questionsBeingEdited: Record<number, string>;
  error: SerializedError | null;
}

const initialState: BlocksState = {
  questions: [],
  blocks: [],
  currentExecutionId: null,
  currentBlockId: null,
  currentParentId: 0,
  initialSpaceId: null,
  currentSpaceId: null,
  shouldUpdateBlocks: false,
  status: "idle",
  blockStatus: "idle" as BlockStatus,
  isAnyEditBlockRunning: false,
  editBlockStatus: {} as EditBlockStatus,
  questionsBeingEdited: {},
  error: null,
};

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    updateBlockStatus: (
      state,
      action: PayloadAction<{ status: BlockStatus }>,
    ) => {
      const { status } = action.payload;
      if (status === "Completed") {
        console.log("Block question has completed");
      }
      state.blockStatus = status;
    },
    updateEditBlockStatus: (
      state,
      action: PayloadAction<{ parentId: number; status: BlockStatus }>,
    ) => {
      state.editBlockStatus[action.payload.parentId] = action.payload.status;
    },
    updateIsAnyBlockUpdateRunning: (state, action: PayloadAction<boolean>) => {
      state.isAnyEditBlockRunning = action.payload;
    },
    updateInitialSpaceId: (state, action: PayloadAction<number | null>) => {
      state.initialSpaceId = action.payload;
    },
    updateCurrentSpaceId: (state, action: PayloadAction<number | null>) => {
      state.currentSpaceId = action.payload;
    },
    updateShouldUpdateBlocks: (state, action: PayloadAction<boolean>) => {
      state.shouldUpdateBlocks = action.payload;
    },
    setQuestionBeingEdited: (
      state,
      action: PayloadAction<{ questionId: number; editedText: string }>,
    ) => {
      const { questionId, editedText } = action.payload;
      state.questionsBeingEdited[questionId] = editedText;
    },
  },
  extraReducers: (builder) => {
    builder
      // Remove askQuestionThunk and getAllQuestionsThunk cases
      .addCase(deleteBlockThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteBlockThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.questions = state.questions.filter(
            (q) => q.id !== action.payload,
          );
        },
      )
      .addCase(deleteBlockThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(getQuestionThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getQuestionThunk.fulfilled,
        (state, action: PayloadAction<QuestionData>) => {
          state.status = "succeeded";
          state.questions.push(action.payload);
        },
      )
      .addCase(getQuestionThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(
        askBlockThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ executionId: string; blockId: string }>,
        ) => {
          state.currentExecutionId = action.payload.executionId;
          state.currentBlockId = action.payload.blockId;
          state.status = "succeeded";
        },
      )
      .addCase(askBlockThunk.rejected, (state, action) => {
        state.blockStatus = "failed";
        state.error = action.error;
      })
      .addCase(
        updateBlockThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ executionId: string; blockId: string }>,
        ) => {
          const { blockId } = action.payload;
          state.currentBlockId = blockId;
          state.status = "succeeded";
          state.editBlockStatus[state.currentParentId] = "Running";
          delete state.questionsBeingEdited[state.currentParentId];
        },
      )
      .addCase(getAllBlocksThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getAllBlocksThunk.fulfilled,
        (state, action: PayloadAction<BlockData[]>) => {
          state.status = "succeeded";
          state.blocks = action.payload;
        },
      )
      .addCase(getAllBlocksThunk.rejected, (state, action) => {
        state.blockStatus = "failed";
        state.error = action.error;
      })
      .addCase(
        getBlockStatusThunk.pending,
        (
          state,
          action: PayloadAction<
            undefined,
            string,
            {
              arg: { executionId: string; actionType: "ask" | "update" };
              requestId: string;
              requestStatus: "pending";
            }
          >,
        ) => {
          const { actionType } = action.meta.arg;
          if (state.currentBlockId) {
            const parentId = Number(state.currentBlockId);
            if (actionType === "ask") {
              state.blockStatus = "Running";
            } else if (actionType === "update") {
              state.editBlockStatus[parentId] = "Running";
            }
          }
        },
      )
      .addCase(
        getBlockStatusThunk.fulfilled,
        (
          state,
          action: PayloadAction<
            { status: string | null; actionType: "ask" | "update" },
            string,
            { requestId: string }
          >,
        ) => {
          const { status, actionType } = action.payload;
          if (
            state.currentBlockId &&
            actionType === "update" &&
            status === "Completed"
          ) {
            state.editBlockStatus[Number(state.currentBlockId)] = "Completed";
          } else if (
            state.currentBlockId &&
            actionType === "ask" &&
            status === "Completed"
          ) {
            state.blockStatus = "Completed";
          }
        },
      )
      .addCase(
        getBlockStatusThunk.rejected,
        (
          state,
          action: PayloadAction<
            unknown,
            string,
            { arg: CustomThunkArg; requestId: string },
            SerializedError
          >,
        ) => {
          const { actionType } = action.meta.arg;
          if (actionType === "update") {
            state.editBlockStatus[Number(action.meta.requestId)] = "failed"; // Change is here, converting requestId to parentId as a number
          } else if (actionType === "ask") {
            state.blockStatus = "failed";
          }
          if (action.error) {
            state.error = action.error;
          }
        },
      );
  },
});

export const { updateBlockStatus: updateBlockStatus } = blocksSlice.actions;
export const { updateEditBlockStatus: updateEditBlockStatus } =
  blocksSlice.actions;
export const { updateIsAnyBlockUpdateRunning: updateIsAnyBlockUpdateRunning } =
  blocksSlice.actions;
export const { updateInitialSpaceId: updateInitialSpaceId } =
  blocksSlice.actions;
export const { updateCurrentSpaceId: updateCurrentSpaceId } =
  blocksSlice.actions;
export const { updateShouldUpdateBlocks: updateShouldUpdateBlocks } =
  blocksSlice.actions;
export const { setQuestionBeingEdited: setQuestionBeingEdited } =
  blocksSlice.actions;

export default blocksSlice.reducer;
