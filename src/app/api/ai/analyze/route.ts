import { getMonthlyTransactionSummary } from "@/services/api/server";
import { tokenCheck } from "@/utils/fetch/serverTokenCheck/serverTokenCheck";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

import dayjs from "dayjs";
import { ITransactionResponseDto } from "@/services/dto/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface IAIResponseDto {
  summary: string;
  problems: string[];
  solutions: string[];
}

export interface IAnalyzeResponseDto {
  code: string;
  message: string;
  data: IAIResponseDto | undefined;
  status: number;
}

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  tokenCheck(request);

  const toDate = dayjs().format("YYYY-MM-DD");

  const monthlyData = (await getMonthlyTransactionSummary(
    id,
    toDate
  )) as ITransactionResponseDto;

  if (monthlyData.expenseLength <= 0) {
    return NextResponse.json(
      {
        message: "There is no data available for analysis.",
        code: "NULL-400",
        status: 400,
      },
      {
        status: 200,
      }
    );
  } else {
    const categoryOfData = Object.fromEntries(
      monthlyData.categoryData.map((item) => [item.type, item.amount])
    );
    const simpleData = {
      i: monthlyData.incomeAmount,
      e: monthlyData.expenseAmount,
      c: {
        f: categoryOfData.FOOD,
        t: categoryOfData.BUS,
        v: categoryOfData.SAVE,
        s: categoryOfData.SHOPPING,
        e: categoryOfData.ETC,
      },
    };
    const prompt = {
      role: "너는 나의 개인 재무 코치이고 아래 데이터를 보고 [출력형식]에 맞춰 간결한 분석과 조언을 한국어로 생성해.",
      keys: "i:총수입, e:총지출, c:카테고리(f:식비, t:교통비, v:저축, s:쇼핑, e:그외)",
      data: simpleData,
      format: {
        summary: "한 문장 요약",
        problems: ["문제점1", "문제점2"],
        solutions: ["해결책1", "해결책2", "해결책3"],
      },
    };
    try {
      const geminiRes = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: JSON.stringify(prompt),
        config: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });
      if (geminiRes.text) {
        const jsonMatch = geminiRes.text.match(/```json\s*([\s\S]*?)\s*```/);
        const textToParse = jsonMatch ? jsonMatch[1] : geminiRes.text;
        const cleanedText = textToParse.replace(/\u00A0/g, "").trim();
        return NextResponse.json(
          {
            code: "COM-200",
            message: "Success",
            data: JSON.parse(cleanedText),
            status: 200,
          },
          { status: 200 }
        );
      }
      //   const responseText = geminiRes.text;
    } catch (error) {
      console.error("Gemini API 호출 오류:", error);
      return NextResponse.json(
        { error: "알 수 없는 오류로 인해 실패하였습니다." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json("hi", { status: 200 });
}
