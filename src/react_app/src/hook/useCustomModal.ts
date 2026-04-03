/**
 * useCustomModal - 커스텀 모달 열기/닫기 관리 훅
 *
 * [목적]
 * Recoil 전역 상태(modalAtom)를 통해 모달을 열고 닫는다.
 * 모달이 열리면 배경 스크롤을 자동으로 잠그고(useDimmed),
 * 닫으면 다시 스크롤을 복원한다.
 *
 * [사용 방법]
 * @example
 * const { openModal, closeModal } = useCustomModal();
 *
 * // 모달 열기 - ReactNode를 전달
 * openModal(
 *   <div className="custom-modal">
 *     <h2>상세 정보</h2>
 *     <p>내용...</p>
 *     <CustomButton onClick={closeModal}>닫기</CustomButton>
 *   </div>
 * );
 *
 * // 모달 닫기
 * closeModal();
 */
import { useAtom } from 'jotai';
import {modalAtom} from '@atom/modalAtom';
import {ReactNode, useEffect, useState} from 'react';
import {useDimmed} from '@hook/useDimmed';

/**
 * 커스텀 모달 관리 훅
 *
 * @returns { openModal, closeModal, modal }
 *   - openModal(content):  모달 열기 (ReactNode 전달)
 *   - closeModal():        모달 닫기
 *   - modal:               현재 모달 내용 (렌더링용, null이면 닫힌 상태)
 */
export const useCustomModal = () => {
    const [modal, setModal] = useAtom(modalAtom);
    const [showDimmed, setShowDimmed] = useState<boolean>(false);
    useDimmed(showDimmed);

    /** 모달 열기 - ReactNode를 전달하면 화면에 표시 */
    const openModal = (m:ReactNode) => {
        setModal(m);
    };

    /** 모달 닫기 - modalAtom을 null로 초기화 */
    const closeModal = () => {
        setModal(null);
    };

    // 모달 상태에 따라 배경 딤 처리
    useEffect(() => {
        setShowDimmed(modal !== null);
    }, [modal]);

    return {openModal, closeModal, modal};
};