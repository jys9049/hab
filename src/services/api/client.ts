import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";

export const getUser = async () => {
  try {
    const res = await fetchWithAuth("/api/auth/getUser");
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
  try {
    const res = await fetchWithAuth(`/api/transaction?id=${id}&date=${date}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        message: "Network response was not ok and failed to parse error JSON",
      }));
      throw new Error(errorData.message || "Network response was not ok");
    }

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
  try {
    const res = await fetchWithAuth(
      `/api/transaction/summary?id=${id}&date=${date}`
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
  try {
    const res = await fetchWithAuth(
      `/api/transaction/getMonthlySummary?id=${id}`
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
  try {
    const res = await fetchWithAuth(
      `/api/transaction/list?id=${id}&page=${pageParam}&limit=5&date=${date}`
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
  try {
    const res = await fetchWithAuth(
      `/api/transaction/getDailySummaryByMonth?id=${id}&date=${date}`
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
