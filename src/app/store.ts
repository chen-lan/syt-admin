import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlice from "@/pages/login/slice";
import appSlice from "./slice";
import hospitalReducer from "@/pages/hospital/hospitalSet/slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice,
    hospitalSearch: hospitalReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;