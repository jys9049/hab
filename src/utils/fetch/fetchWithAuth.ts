import { getCookie, setCookie } from "cookies-next";

let refreshingPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshingPromise) {
    refreshingPromise = fetch("/api/auth/refresh", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        const newToken = data.data;
        setCookie("accessToken", newToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60,
          path: "/",
        });
        return newToken;
      })
      .finally(() => {
        refreshingPromise = null; // 다시 초기화
      });
  }
  return refreshingPromise;
}

export async function fetchWithAuth(
  req: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  let res = await fetch(req, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  if (res.status === 401 && !refreshToken) {
    accessToken = (await refreshAccessToken()) as string;

    res = await fetch(req, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });
  }

  return res;
}
