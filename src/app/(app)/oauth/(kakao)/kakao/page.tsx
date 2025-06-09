import { redirect } from "next/navigation";

const getToken = async (code: string) => {
  const res = await fetch(`${process.env.BASE_URL}/api/auth/kakaoLogin`, {
    method: "POST",
    body: JSON.stringify({ code }),
    credentials: "include",
  });

  if (res.ok) {
    const resData = await res.json();

    return resData.data;
  }
};

const getTestLogin = async (testId: string) => {
  const res = await fetch(`${process.env.BASE_URL}/api/auth/testLogin`, {
    method: "POST",
    body: JSON.stringify({ testId }),
    credentials: "include",
  });

  if (res.ok) {
    const resData = await res.json();

    return resData.data;
  }
};

const KakaoLogin = async ({
  searchParams,
}: {
  searchParams: Promise<{
    code: string | undefined;
    testId: string | undefined;
  }>;
}) => {
  const code = (await searchParams).code;
  const testId = (await searchParams).testId;

  let token = "";

  if (code) {
    token = await getToken(code);
  } else if (testId) {
    token = await getTestLogin(testId);
  }

  if (token) {
    redirect(`/oauth/kakao/redirect?${token}`);
  }

  return <></>;
};

export default KakaoLogin;
