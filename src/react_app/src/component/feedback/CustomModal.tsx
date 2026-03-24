import {Modal} from 'antd';
import {ModalProps} from 'antd/es/modal/interface';

export interface CustomModalProps extends ModalProps{

}

const CustomModal = (props:CustomModalProps) => {
    return (
        <>
            <Modal
                {...props}
                okText={props.okText ? props.okText : '확인'}
                cancelText={props.cancelText ? props.cancelText : '취소'}
            >
                {props.children}
            </Modal>
        </>
    );
};

export default CustomModal;