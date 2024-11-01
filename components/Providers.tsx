"use client";
//provider.js
import { store } from "@/store";
import { Provider } from "react-redux";
import ReduxUserStateProvider from "./ReduxUserStateProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
