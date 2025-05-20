import { create } from "zustand";

type UserStateType = {
  user: TUserType;
};

type UserActionType = {
  setUser: (user: TUserType) => void;
};

export type TUserType = {
  id: string;
  email: string;
  nickname: string;
  profile_img: string;
};

const useUserStore = create<UserStateType & UserActionType>()((set) => ({
  user: {
    id: "",
    email: "",
    nickname: "",
    profile_img: "",
  },
  setUser: (user: TUserType) => set(() => ({ user: user })),
}));

export { useUserStore };
