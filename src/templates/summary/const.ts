import { ChartOptions } from "chart.js";

export const donutChartOptions = {
  backgroundColor: [
    "#ffe8e8",
    "#e5f1ff",
    "#e8fceb",
    "#e6f8f5",
    "#f0e8ff",
    "#fff0e5",
  ],
  borderWidth: 0,
  hoverOffset: 0,
};

export const donutDisplayOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const value = context.raw || 0;
          return `₩ ${value.toLocaleString()}`;
        },
      },
    },
  },
};

export const barChartOptions = {
  label: "지출",
  backgroundColor: "#ffe8e8",
  borderRadius: 4,
};

export const barChartDisplayOptions: ChartOptions<"bar"> = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false, // x축 격자선 제거
      },
    },
    y: {
      display: false, // 왼쪽 수치 및 선 제거
      grid: {
        display: false, // y축 격자선 제거
      },
      ticks: {
        display: false, // 눈금 숫자 제거
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: undefined,
  },
};
