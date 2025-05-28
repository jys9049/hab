import React from "react";
import Modal from "../Modal";
import Typography from "../Typography";
import st from "./styles.module.scss";

import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import { toast } from "react-toastify";

const ResetModal = ({ isOpen, handleClose }) => {
  const { mutate: withdrawal } = useMutation({
    mutationFn: () => {
      return fetchWithAuth("/api/transaction/delete/all", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast("성공적으로 초기화가 되셨습니다.");
      handleClose();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleWithdrawalClick = () => {
    withdrawal();
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <Typography variant="title" color="point">
        가계부를 초기화 하시겠습니까??
      </Typography>
      <div className={st.listWrap}>
        <Typography variant="small">
          가계부 초기화 시 저장된 모든 정보가 즉시 영구적으로 삭제되며, 복구할
          수 없습니다.
        </Typography>
      </div>
      <div className={st.buttonGroup}>
        <button className={st.withdrawalBtn} onClick={handleWithdrawalClick}>
          초기화
        </button>
        <button className={st.cancelBtn} onClick={handleClose}>
          취소하기
        </button>
      </div>
    </Modal>
  );
};

export default ResetModal;
