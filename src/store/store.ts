import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import bibliotecaSlice from "./slices/bibliotecaSlice";


export const store = configureStore({
  reducer: {
    biblioteca: bibliotecaSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
