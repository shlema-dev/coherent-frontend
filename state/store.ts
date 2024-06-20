// store.js
import { configureStore } from "@reduxjs/toolkit";
import spacesReducer from "./spaces/spaces-slice";
import spaceReducer from "./space/space-slice";
import documentsReducer from "./documents/documents-slice";
import blocksReducer from "./blocks/blocks-slice";
import sourcesReducer from "./sources/sources-slice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    spaces: spacesReducer,
    space: spaceReducer,
    documents: documentsReducer,
    sources: sourcesReducer,
    blocks: blocksReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
