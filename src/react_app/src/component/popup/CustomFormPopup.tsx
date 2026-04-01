/**
 * CustomFormPopup - react-hook-form 연동 폼 팝업 컴포넌트
 *
 * [목적]
 * 폼을 포함한 모달 팝업의 공통 베이스 컴포넌트다.
 * onOk 클릭 시 react-hook-form의 handleSubmit을 호출하는 패턴을 캡슐화하여
 * 매번 히든 버튼(formRef)을 만들지 않아도 된다.
 * maskClosable=false, destroyOnClose=true를 기본 적용한다.
 *
 * @param onSubmit - OK 버튼 클릭 시 실행할 함수.
 *                  react-hook-form의 handleSubmit(handler)를 그대로 전달하면 된다.
 *
 * [사용 방법]
 * @example
 * import CustomFormPopup from '@component/popup/CustomFormPopup';
 *
 * interface FormValues { userName: string; useYn: string; }
 *
 * const MyFormPopup = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
 *   const { control, handleSubmit, reset } = useForm<FormValues>();
 *
 *   const handleSave = async (values: FormValues) => {
 *     await callSave(values);
 *     onClose();
 *   };
 *
 *   return (
 *     <CustomFormPopup
 *       title="사용자 등록"
 *       open={open}
 *       onSubmit={handleSubmit(handleSave)}
 *       onCancel={() => { reset(); onClose(); }}
 *     >
 *       <form>
 *         <CustomSaveFormInput name="userName" title="사용자명" control={control} required />
 *         <CustomSaveFormSelect name="useYn" title="사용여부" control={control} options={useYnOptions} />
 *       </form>
 *     </CustomFormPopup>
 *   );
 * };
 *
 * // 수정 팝업 — 초기값 주입
 * const EditFormPopup = ({ open, onClose, record }: Props) => {
 *   const { control, handleSubmit, reset } = useForm<FormValues>();
 *
 *   useEffect(() => {
 *     if (open && record) reset(record);
 *   }, [open, record]);
 *
 *   return (
 *     <CustomFormPopup
 *       title="사용자 수정"
 *       open={open}
 *       onSubmit={handleSubmit(handleSave)}
 *       onCancel={() => { reset(); onClose(); }}
 *       width={600}
 *     >
 *       <form>...</form>
 *     </CustomFormPopup>
 *   );
 * };
 */
import React from 'react';
import CustomModal, {CustomModalProps} from '@component/feedback/CustomModal';

interface CustomFormPopupProps extends Omit<CustomModalProps, 'onOk'> {
    onSubmit: () => void;
}

const CustomFormPopup = ({onSubmit, children, ...modalProps}: CustomFormPopupProps) => {
    return (
        <CustomModal
            maskClosable={false}
            destroyOnClose
            {...modalProps}
            onOk={onSubmit}
        >
            {children}
        </CustomModal>
    );
};

export default CustomFormPopup;
