import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hab.jeongyongseong.kr";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`, // 로그인 페이지 추가
      lastModified: new Date(),
      changeFrequency: "yearly", // 로그인 페이지는 내용 변경이 거의 없으므로
      priority: 0.5,
    },
  ];
}
