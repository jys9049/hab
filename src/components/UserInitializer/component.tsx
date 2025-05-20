"use client";

import useLoadingStore from "@/lib/zustand/store/useLoadingStore";
import { useUserStore } from "@/lib/zustand/store/useUserStore";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const UserInitializer = () => {
  const pathname = usePathname();
  const userStore = useUserStore((state) => state);
  const { startLoginLoading, stopLoginLoading } = useLoadingStore();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || pathname === "/login") return;

    const initUser = async () => {
      startLoginLoading();

      try {
        const res = await fetchWithAuth("/api/auth/getUser");
        if (res.ok) {
          const responseData = await res.json();
          userStore.setUser({
            id: responseData.data.id,
            nickname: responseData.data.nickname,
            email: responseData.data.email,
            profile_img: responseData.data.profile_img,
          });
        }
      } catch (error) {
        console.error("getUser error:", error);
      } finally {
        stopLoginLoading();
      }
    };

    initUser();
  }, [hasMounted, pathname, stopLoginLoading]);

  return null;
};

export default UserInitializer;
