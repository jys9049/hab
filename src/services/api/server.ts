"use server";

import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import { cookies } from "next/headers";

export const getUser = async () => {
  const accessToken = (await cookies()).get("accessToken");

  try {
    const res = await fetchWithAuth("/api/auth/getUser", {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken.value}` : "",
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        message: "Network response was not ok and failed to parse error JSON",
      }));
      throw new Error(errorData.message || "Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getTransaction = async (id: string, date: string) => {
  const accessToken = (await cookies()).get("accessToken");
  try {
    const res = await fetchWithAuth(`/api/transaction?id=${id}&date=${date}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken.value}` : "",
      },
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const getMonthlyTransactionSummary = async (
  id: string,
  date: string
) => {
  const accessToken = (await cookies()).get("accessToken");
  try {
    const res = await fetchWithAuth(
      `/api/transaction/summary?id=${id}&date=${date}`,
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken.value}` : "",
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        message: "Network response was not ok and failed to parse error JSON",
      }));
      throw new Error(errorData.message || "Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getMonthlySummary = async (id: string) => {
  const accessToken = (await cookies()).get("accessToken");
  try {
    const res = await fetchWithAuth(
      `/api/transaction/getMonthlySummary?id=${id}`,
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken.value}` : "",
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        message: "Network response was not ok and failed to parse error JSON",
      }));
      throw new Error(errorData.message || "Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllMonthlyTransactionData = async (
  id: string,
  pageParam: number,
  date: string
) => {
  const accessToken = (await cookies()).get("accessToken");
  try {
    const res = await fetchWithAuth(
      `/api/transaction/list?id=${id}&page=${pageParam}&limit=5&date=${date}`,
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken.value}` : "",
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        message: "Network response was not ok and failed to parse error JSON",
      }));
      throw new Error(errorData.message || "Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getDailySummaryByMonth = async (id: string, date: string) => {
  const accessToken = (await cookies()).get("accessToken");
  try {
    const res = await fetchWithAuth(
      `/api/transaction/getDailySummaryByMonth?id=${id}&date=${date}`,
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken.value}` : "",
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        message: "Network response was not ok and failed to parse error JSON",
      }));
      throw new Error(errorData.message || "Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};
