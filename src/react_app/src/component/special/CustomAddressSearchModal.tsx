import {Modal} from 'antd';
import {ModalProps} from 'antd/es/modal/interface';
import DaumPostcode, {Address} from "react-daum-postcode";
import {Search, State} from "react-daum-postcode/lib/loadPostcode";
import CustomButton from "@component/button/CustomButton";
import React from "react";

export interface CustomAddressSearchModalProps extends ModalProps{
    onAddrSearchComplete: (data: Address) => void;  //우편번호 검색 결과 목록에서 특정 항목을 클릭한 경우, 해당 정보를 받아서 처리할 콜백 함수를 정의하는 부분
    onAddrSearchClose?: (state: State) => void; //검색 결과를 선택하거나, 브라우저의 닫기버튼을 통해 닫았을 때 발생하는 콜백 함수를 정의하는 부분
    onAddrSearch?: (search: Search) => void; //주소를 검색할 경우에 실행되는 콜백함수
}

const CustomAddressSearchModal = (props : CustomAddressSearchModalProps) => {

    return (
        <>
            <Modal
                open={props.open}
                closable={false}
                footer={[
                    <CustomButton key="cancelAddressSearch" type="primary" onClick={props.onCancel}>
                        취소
                    </CustomButton>
                ]}
                destroyOnClose={true}
            >
                <DaumPostcode
                    onComplete={props.onAddrSearchComplete}
                    onClose={props.onAddrSearchClose}
                    onSearch={props.onAddrSearch}
                    autoClose={false}
                />
            </Modal>
        </>
    );
};

export default CustomAddressSearchModal;