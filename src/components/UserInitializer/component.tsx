"use client";

import useLoadingStore from "@/lib/zustand/store/useLoadingStore";
import { useUserStore } from "@/lib/zustand/store/useUserStore";
import { getUser } from "@/services/api/client";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const UserInitializer = () => {
  const pathname = usePathname();
  const setUser = useUserStore((state) => state.setUser);
  const { startLoginLoading, stopLoginLoading } = useLoadingStore();

  const [hasMounted, setHasMounted] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || pathname === "/login") return;

    const initUser = async () => {
      startLoginLoading();

      if (isSuccess) {
        setUser({
          id: data.data.id,
          nickname: data.data.nickname,
          email: data.data.email,
          profile_img: data.data.profile_img,
        });
        stopLoginLoading();
      }
    };

    initUser();
  }, [hasMounted, pathname, isSuccess]);

  return null;
};

export default UserInitializer;
