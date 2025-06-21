"use client";

import Typography from "@/components/Typography";
import React, { useState } from "react";
import st from "./styles.module.scss";
import Robot from "@/assets/robot.svg";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import { useUserStore } from "@/lib/zustand/store/useUserStore";
import { useMutation } from "@tanstack/react-query";
import {
  IAIResponseDto,
  IAnalyzeResponseDto,
} from "@/app/api/ai/analyze/route";
import { toast } from "react-toastify";

const AIAnalyzePage = () => {
  const id = useUserStore((state) => state.user).id;
  const [clicked, setClicked] = useState(false);
  const [analyze, setAnalyze] = useState<IAIResponseDto>();

  const handleAIClick = () => {
    setClicked(true);
    aiMutate();
  };

  const { mutate: aiMutate } = useMutation({
    mutationFn: () => {
      return fetchWithAuth("/api/ai/analyze", {
        method: "POST",
        body: JSON.stringify({ id: id }),
      });
    },
    onSuccess: async (res) => {
      const { code, status, data } = (await res.json()) as IAnalyzeResponseDto;
      setClicked(false);
      if (status === 200) {
        setAnalyze(data);
      } else {
        if (code === "NULL-400")
          toast("분석할 수 있는 데이터가 없습니다.", {
            type: "error",
          });
      }
    },
  });

  return (
    <div className={st.container}>
      <div className={st.header}>
        <Typography variant="title">AI 분석</Typography>
        <Typography variant="small">
          AI가 사용자님의 이번달 소비 패턴을 분석하여 공유해드립니다
        </Typography>
      </div>
      <div className={st.btnContainer}>
        <button
          className={`${st.analyzeBtn} ${clicked && st.clicked}`}
          disabled={!!analyze}
          onClick={handleAIClick}
        >
          <Robot />
          {!clicked && (
            <Typography variant="subTitle" color="white">
              {!!analyze ? "AI 분석 완료" : "AI 분석하기"}
            </Typography>
          )}
        </button>
      </div>
      {!!analyze && (
        <div className={st.resultContainer}>
          <Typography variant="title" color="point">
            사용자님의 소비 패턴을 분셕한 결과입니다.
          </Typography>
          <div className={st.resultWrap}>
            <Typography variant="subTitle">소비 패턴 요약</Typography>
            <Typography variant="small">{analyze.summary}</Typography>
          </div>
          <div className={st.resultWrap}>
            <Typography variant="subTitle">문제점</Typography>
            {analyze.problems.map((problem, idx) => (
              <div key={`${problem}_${idx}`} className={st.textWrap}>
                <Typography variant="small">{problem}</Typography>
              </div>
            ))}
          </div>
          <div className={st.resultWrap}>
            <Typography variant="subTitle">해결방안</Typography>
            {analyze.solutions.map((solution, idx) => (
              <div key={`${solution}_${idx}`} className={st.textWrap}>
                <Typography variant="small">{solution}</Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalyzePage;
