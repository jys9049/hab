import React from "react";
import Modal from "../Modal";
import Typography from "../Typography";
import st from "./styles.module.scss";

import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const WithdrawalModal = ({ isOpen, handleClose }) => {
  const route = useRouter();

  const { mutate: withdrawal } = useMutation({
    mutationFn: () => {
      return fetchWithAuth("/api/auth/withdrawal", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast("성공적으로 초기화가 되셨습니다.");
      handleClose();
      route.push("/login");
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
        회원 탈퇴하시겠습니까?
      </Typography>
      <ul className={st.listWrap}>
        <li>
          <Typography variant="small">
            회원 탈퇴 시 계정에 저장된 모든 정보가 즉시 영구적으로 삭제되며,
            복구할 수 없습니다.
          </Typography>
        </li>
        <li>
          <Typography variant="small">
            탈퇴 후에는 현재 계정으로 [슬기로운 지갑생활]의 모든 서비스를
            이용하실 수 없게 됩니다.
          </Typography>
        </li>
      </ul>
      <div className={st.buttonGroup}>
        <button className={st.withdrawalBtn} onClick={handleWithdrawalClick}>
          탈퇴하기
        </button>
        <button className={st.cancelBtn} onClick={handleClose}>
          취소하기
        </button>
      </div>
    </Modal>
  );
};

export default WithdrawalModal;
