import {useRecoilState} from 'recoil';
import {confirmAtom} from '@atom/confirmAtom';
import {alertAtom} from '@atom/alertAtom';

export const useMessage = () => {
    const [confirmState, setConfirmState] = useRecoilState(confirmAtom);
    const [alertState, setAlertState] = useRecoilState(alertAtom);

    const confirm = (message?: string, okText?: string, cancelText?:string): Promise<boolean> => {
        return new Promise((resolve) => {
            // state를 변경해 Confirm 다이얼로그를 띄운다.
            setConfirmState({
                message: message ?? '',
                okText: okText ?? '확인',
                cancelText: cancelText ?? '취소',
                onClickOK: () => {
                    // ok 클릭한 경우, 다이얼로그 닫고 true로 Promise 종료
                    setConfirmState({...confirmState, message: '', isOpen:false});
                    resolve(true);
                },
                onClickCancel: () => {
                    // cancel 클릭한 경우, 다이얼로그 닫고 false로 Promise 종료
                    setConfirmState({...confirmState,  message: '', isOpen:false});
                    resolve(false);
                },
                isOpen:true
            });
        });
    };


     const alert = (message?: string, okText?: string): Promise<boolean> => {
        return new Promise((resolve) => {
            // state를 변경해 Confirm 다이얼로그를 띄운다.
            setAlertState({
                message: message ?? '',
                okText: okText ?? '확인',
                onClickOK: () => {
                    // ok 클릭한 경우, 다이얼로그 닫고 true로 Promise 종료
                    setAlertState({...alertState, message: '', isOpen:false});
                    resolve(true);
                },
                isOpen:true
            });
        });
    };


    return {confirm, alert};
};
