"use client";

import React, { useEffect, useState } from "react";
import { IHistoryDetailProps } from "./types";
import Modal from "@/components/Modal";
import Typography from "../Typography";
import CloseIcon from "@/assets/Close.svg";

import st from "./styles.module.scss";
import dayjs from "dayjs";
import CategorySelect from "@/components/CategorySelect";
import { IParentHistoryType } from "@/components/AddHistory/types";
import CategoryIcon from "../CategoryIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import { useUserStore } from "@/lib/zustand/store/useUserStore";
import { toast } from "react-toastify";

const HistoryDetail = ({
  isOpen,
  handleClose,
  history,
  date,
}: IHistoryDetailProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  const [updateHistory, setUpdateHistory] =
    useState<IParentHistoryType | null>();

  useEffect(() => {
    if (history)
      setUpdateHistory({
        ...history,
        amount: Number(history?.amount).toLocaleString(),
      });
  }, [history]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value: inputValue } = e.target;

    if (!updateHistory) return;
    if (id === "amount") {
      const rawValue = inputValue.replace(/,/g, "");
      if (rawValue !== "" && !/^\d+$/.test(rawValue)) return;
      const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setUpdateHistory({ ...updateHistory, [id]: formatted });
    } else {
      setUpdateHistory({ ...updateHistory, [id]: inputValue });
    }
  };

  const handleCategoryClick = (category: string) => {
    if (updateHistory) {
      setUpdateHistory({ ...updateHistory, category: category });
    }
  };

  const handleEditClick = () => {
    if (isEdit) {
      updateClick();
    } else {
      setIsEdit(!isEdit);
    }
  };

  const handleModalClose = () => {
    handleClose();
    setIsEdit(false);
  };

  const { mutate: updateClick } = useMutation({
    mutationFn: () => {
      return fetchWithAuth("/api/transaction/update", {
        method: "POST",
        body: JSON.stringify(updateHistory),
      });
    },
    onSuccess: () => {
      setIsEdit(false);
      toast("내역이 성공적으로 수정되었습니다", {
        type: "success",
        autoClose: 500,
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", user.id, date],
      });
    },
  });

  const { mutate: deleteClick } = useMutation({
    mutationFn: () => {
      return fetchWithAuth(`/api/transaction/delete?id=${history?.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      handleModalClose();
      toast("내역이 성공적으로 삭제되었습니다", {
        type: "success",
        autoClose: 500,
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", user.id, date],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!history?.id) {
      console.error("삭제할 항목의 ID가 없습니다.");
      return;
    }

    deleteClick();
  };

  if (!history) return <></>;

  return (
    <Modal isOpen={isOpen} handleClose={handleModalClose}>
      <div className={st.container}>
        <div className={st.header}>
          <Typography variant="title">상세 내역</Typography>
          <button className={st.backBtn} onClick={handleModalClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={st.contentWrap}>
          <div className={st.flexWrap}>
            <Typography>일시</Typography>
            <Typography>
              {dayjs(updateHistory?.date).format("YYYY-MM-DD HH:mm")}
            </Typography>
          </div>
          <div className={st.flexWrap}>
            <Typography>카테고리</Typography>
            {isEdit ? (
              <CategorySelect
                category={updateHistory?.category}
                fullWidth={false}
                handleClick={handleCategoryClick}
              />
            ) : (
              <CategoryIcon
                variant={updateHistory?.category}
                size="BIG"
                color="black"
              />
            )}
          </div>
          <div className={st.flexWrap}>
            <Typography>금액</Typography>
            {isEdit ? (
              <div
                className={`${st.amountInputContainer} ${st.inputContainer}`}
              >
                <input
                  id="amount"
                  className={st.amountInput}
                  placeholder="0"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={updateHistory ? updateHistory.amount : 0}
                  onChange={handleValueChange}
                />
                <span className={st.amountTitle}>₩</span>
              </div>
            ) : (
              <Typography color={history.category === "PAY" ? "green" : "red"}>
                ₩{" "}
                {Number(
                  updateHistory?.amount.replaceAll(",", "")
                ).toLocaleString()}
              </Typography>
            )}
          </div>
          <div className={st.flexWrap}>
            <Typography>메모</Typography>
            {isEdit ? (
              <input
                id="memo"
                className={st.inputContainer}
                value={updateHistory ? updateHistory?.memo : ""}
                onChange={handleValueChange}
              />
            ) : (
              <Typography>{updateHistory?.memo}</Typography>
            )}
          </div>
        </div>
        <div className={st.btnWrap}>
          <button
            className={`${st.btn} ${st.editBtn}`}
            onClick={handleEditClick}
          >
            <Typography color="white">{isEdit ? "완료" : "수정"}</Typography>
          </button>
          <button
            className={`${st.btn} ${st.deleteBtn}`}
            onClick={handleDelete}
          >
            <Typography color="white">삭제</Typography>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HistoryDetail;
