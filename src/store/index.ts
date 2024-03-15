import { configureStore } from "@reduxjs/toolkit";
import presale from "./presale";
import wallet from "./wallet";

export const store = configureStore({
  reducer: {
    presale,
    wallet,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
