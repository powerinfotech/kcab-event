import CustomModal, {CustomModalProps} from '@component/CustomModal';
import React from 'react';


const TestPopup =  (props:CustomModalProps) => {
    return (
        <CustomModal {...props}>
            <div>
                <h3>test 팝업 본문</h3>
                <p>가나다라마바사</p>
                <p>ABCDEFGHIJKLMNOP</p>
            </div>
        </CustomModal>
    );
};

export default TestPopup;