import {
  askBlockThunk,
  updateBlockThunk,
} from "@/state/blocks/ask-block-thunk";
import { getBlockStatusThunk } from "@/state/blocks/block-status-thunk";
import {
  BlockStatus,
  updateBlockStatus,
  updateCurrentSpaceId,
  updateEditBlockStatus,
  updateInitialSpaceId,
  updateIsAnyBlockUpdateRunning,
  updateShouldUpdateBlocks,
} from "@/state/blocks/blocks-slice";
import { deleteBlockThunk } from "@/state/blocks/delete-block-thunk";
import { getAllBlocksThunk } from "@/state/blocks/get-all-blocks-thunk";
import { AppDispatch } from "@/state/store";

export const updateBlocks = async (
  initialId: number,
  dispatch: AppDispatch,
) => {
  await dispatch(getAllBlocksThunk(initialId));
  dispatch(updateInitialSpaceId(null));
};

export const askQuestion = async (
  question: string,
  sessionId: string | null,
  id: string | string[],
  dispatch: AppDispatch,
) => {
  console.log("handleAskQuestion invoked");
  if (sessionId && typeof id === "string") {
    dispatch(updateCurrentSpaceId(Number(id)));
    dispatch(updateInitialSpaceId(Number(id)));

    const res = await dispatch(
      askBlockThunk({
        spaceId: Number(id),
        name: "",
        prompt: question,
        type: "",
        scope: "any",
        parentId: 0,
      }),
    );

    if (res.payload) {
      const { execution_id } = res.payload;
      dispatch(updateBlockStatus({ status: "Running" }));

      const statusRes = await dispatch(
        getBlockStatusThunk({ executionId: execution_id, actionType: "ask" }),
      );
      const payload = statusRes.payload as {
        status: BlockStatus;
        actionType: "ask" | "update";
      };

      if (payload && payload.status === "Completed") {
        dispatch(updateBlockStatus({ status: "Completed" }));
        dispatch(updateShouldUpdateBlocks(true));
      }
    }
  }
};

export const updateQuestion = async (
  newPrompt: string,
  parentId: number,
  oldBlockId: number,
  sessionId: string | null,
  id: string | string[],
  dispatch: AppDispatch,
) => {
  console.log("handleUpdateQuestion invoked");

  if (sessionId && typeof id === "string") {
    dispatch(updateCurrentSpaceId(Number(id)));
    dispatch(updateInitialSpaceId(Number(id)));

    const finalParentId = parentId === 0 ? oldBlockId : parentId;

    const res = await dispatch(
      updateBlockThunk({
        spaceId: Number(id),
        name: "",
        prompt: newPrompt,
        type: "",
        scope: "any",
        parentId: finalParentId,
      }),
    );

    if (res.payload) {
      const { execution_id, block_id } = res.payload;

      dispatch(
        updateEditBlockStatus({ parentId: oldBlockId, status: "Running" }),
      );
      dispatch(updateIsAnyBlockUpdateRunning(true));

      const statusRes = await dispatch(
        getBlockStatusThunk({
          executionId: execution_id,
          actionType: "update",
        }),
      );

      const payload = statusRes.payload as {
        status: string | null;
        actionType: "ask" | "update";
      }; // Cast to the expected type

      if (payload && payload.status === "Completed") {
        console.log("Block status completed.");
        console.log("Current block id in space: ", block_id);

        dispatch(
          updateEditBlockStatus({ parentId: oldBlockId, status: "Completed" }),
        );
        dispatch(updateIsAnyBlockUpdateRunning(false));
        dispatch(updateShouldUpdateBlocks(true));
      }
    }
  }
};

export const deleteQuestion = async (
  blockId: number,
  sessionId: string | null,
  id: string | string[],
  dispatch: AppDispatch,
) => {
  if (sessionId && typeof id === "string") {
    await dispatch(
      deleteBlockThunk({ sessId: sessionId, spaceId: Number(id), blockId }),
    );
    await dispatch(getAllBlocksThunk(Number(id)));
  }
};
