/**
 * useMessage - 확인(Confirm) / 알림(Alert) 다이얼로그 훅
 *
 * [목적]
 * window.confirm / window.alert 대신 Ant Design 스타일의 커스텀 다이얼로그를 사용.
 * Promise 기반으로 동작하여 async/await로 사용자 응답을 받을 수 있다.
 * Recoil atom(confirmAtom, alertAtom)을 통해 전역 다이얼로그 Provider와 연동.
 *
 * [사용 방법]
 * @example
 * const { confirm, alert } = useMessage();
 *
 * // 확인 다이얼로그 (확인/취소 버튼)
 * const handleDelete = async () => {
 *   const isOk = await confirm('정말 삭제하시겠습니까?');
 *   if (isOk) {
 *     await callDeleteData(selectedKeys);
 *   }
 * };
 *
 * // 버튼 텍스트 커스텀
 * const isOk = await confirm('저장하시겠습니까?', '저장', '돌아가기');
 *
 * // 알림 다이얼로그 (확인 버튼만)
 * const handleComplete = async () => {
 *   await alert('저장이 완료되었습니다.');
 *   reload(); // 확인 버튼 클릭 후 실행
 * };
 */
import { useAtom } from 'jotai';
import {confirmAtom} from '@atom/confirmAtom';
import {alertAtom} from '@atom/alertAtom';

/**
 * 확인/알림 다이얼로그 훅
 *
 * @returns { confirm, alert }
 *   - confirm(message?, okText?, cancelText?): 확인/취소 다이얼로그 → Promise<boolean>
 *   - alert(message?, okText?):                알림 다이얼로그 → Promise<boolean>
 */
export const useMessage = () => {
    const [confirmState, setConfirmState] = useAtom(confirmAtom);
    const [alertState, setAlertState] = useAtom(alertAtom);

    /**
     * 확인 다이얼로그 표시
     * - 확인 클릭 → true 반환
     * - 취소 클릭 → false 반환
     *
     * @param message    - 다이얼로그 메시지 (기본: '')
     * @param okText     - 확인 버튼 텍스트 (기본: '확인')
     * @param cancelText - 취소 버튼 텍스트 (기본: '취소')
     */
    const confirm = (message?: string, okText?: string, cancelText?:string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                message: message ?? '',
                okText: okText ?? '확인',
                cancelText: cancelText ?? '취소',
                onClickOK: () => {
                    setConfirmState(prev => prev ? {...prev, message: '', isOpen: false} : prev);
                    resolve(true);
                },
                onClickCancel: () => {
                    setConfirmState(prev => prev ? {...prev, message: '', isOpen: false} : prev);
                    resolve(false);
                },
                isOpen:true
            });
        });
    };

    /**
     * 알림 다이얼로그 표시
     * - 확인 클릭 → true 반환
     *
     * @param message - 다이얼로그 메시지 (기본: '')
     * @param okText  - 확인 버튼 텍스트 (기본: '확인')
     */
     const alert = (message?: string, okText?: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setAlertState({
                message: message ?? '',
                okText: okText ?? '확인',
                onClickOK: () => {
                    setAlertState(prev => prev ? {...prev, message: '', isOpen: false} : prev);
                    resolve(true);
                },
                isOpen:true
            });
        });
    };


    return {confirm, alert};
};
