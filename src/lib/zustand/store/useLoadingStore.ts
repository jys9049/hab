import { create } from "zustand";
import { devtools } from "zustand/middleware";

type LoadingStateType = {
  loginLoading: boolean;
};

type LoadingActionType = {
  startLoginLoading: () => void;
  stopLoginLoading: () => void;
};

const useLoadingStore = create<LoadingStateType & LoadingActionType>()(
  devtools((set) => ({
    count: 0,
    loginLoading: true,
    startLoginLoading: () => set({ loginLoading: true }),
    stopLoginLoading: () => set({ loginLoading: false }),
  }))
);

export default useLoadingStore;
