/**
 * CustomModal - 확인/취소 텍스트 기본값 적용 모달 컴포넌트
 *
 * [목적]
 * Ant Design Modal을 래핑하여 한국어 기본값(okText='확인', cancelText='취소')을 적용한다.
 * 프로젝트 내 모든 모달에서 버튼 텍스트를 별도 지정할 필요가 없어진다.
 *
 * [사용 방법]
 * @example
 * const [open, setOpen] = useState(false);
 *
 * // 기본 모달 (버튼 텍스트 자동 한국어)
 * <CustomModal
 *   title="사용자 등록"
 *   open={open}
 *   onOk={handleSave}
 *   onCancel={() => setOpen(false)}
 * >
 *   <p>모달 내용</p>
 * </CustomModal>
 *
 * // 버튼 텍스트 오버라이드
 * <CustomModal okText="삭제" cancelText="돌아가기" ... />
 *
 * // 검색 팝업 → CustomSearchPopup 사용 권장
 */
import {Modal} from 'antd';
import {ModalProps} from 'antd/es/modal/interface';

export interface CustomModalProps extends ModalProps{

}

const CustomModal = (props:CustomModalProps) => {
    return (
        <Modal
            {...props}
            okText={props.okText ?? '확인'}
            cancelText={props.cancelText ?? '취소'}
        >
            {props.children}
        </Modal>
    );
};

export default CustomModal;