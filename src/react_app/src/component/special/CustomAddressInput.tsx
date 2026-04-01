/**
 * CustomAddressInput - 주소 검색 버튼 포함 입력 컴포넌트
 *
 * [목적]
 * 읽기 전용 Input(우편번호)과 주소 Input, 검색 버튼을 조합하여
 * 주소를 선택하는 입력 필드를 제공한다.
 * 버튼 클릭 시 CustomAddressSearchModal이 열리고,
 * 선택된 주소 정보를 onChange로 전달한다.
 *
 * @param zipCode         - 우편번호 표시값
 * @param address         - 주소 표시값
 * @param onChange        - 주소 선택 시 { zipCode, address, addressDetail? } 전달 콜백
 * @param addressDetail   - 상세주소 입력값
 * @param onChangeDetail  - 상세주소 변경 핸들러
 * @param disabled        - 비활성화 여부
 *
 * [사용 방법]
 * @example
 * import CustomAddressInput from '@component/special/CustomAddressInput';
 *
 * const [zipCode, setZipCode] = useState('');
 * const [address, setAddress] = useState('');
 * const [addressDetail, setAddressDetail] = useState('');
 *
 * // 기본 사용 (우편번호 + 주소 + 상세주소)
 * <CustomAddressInput
 *   zipCode={zipCode}
 *   address={address}
 *   addressDetail={addressDetail}
 *   onChange={({ zipCode, address }) => {
 *     setZipCode(zipCode);
 *     setAddress(address);
 *   }}
 *   onChangeDetail={(e) => setAddressDetail(e.target.value)}
 * />
 *
 * // 상세주소 없이 사용
 * <CustomAddressInput
 *   zipCode={zipCode}
 *   address={address}
 *   onChange={({ zipCode, address }) => {
 *     setZipCode(zipCode);
 *     setAddress(address);
 *   }}
 * />
 *
 * // 비활성화
 * <CustomAddressInput zipCode={zipCode} address={address} onChange={() => {}} disabled />
 */
import React, {useState} from 'react';
import {Button, Input} from 'antd';
import IconBtnSearch from '@icon/IconBtnSearch';
import CustomAddressSearchModal from '@component/special/CustomAddressSearchModal';
import {Address} from 'react-daum-postcode';

interface AddressResult {
    zipCode: string;
    address: string;
}

export interface CustomAddressInputProps {
    zipCode?: string;
    address?: string;
    addressDetail?: string;
    onChange: (result: AddressResult) => void;
    onChangeDetail?: React.ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
}

const CustomAddressInput = ({
    zipCode = '',
    address = '',
    addressDetail,
    onChange,
    onChangeDetail,
    disabled = false,
}: CustomAddressInputProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleComplete = (data: Address) => {
        onChange({
            zipCode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
        });
        setModalOpen(false);
    };

    return (
        <div className="address-input-wrap">
            <span className="address-zip-row">
                <Input readOnly value={zipCode} placeholder="우편번호" disabled={disabled} />
                <Button
                    type="primary"
                    onClick={() => setModalOpen(true)}
                    disabled={disabled}
                >
                    <IconBtnSearch />
                </Button>
            </span>
            <Input readOnly value={address} placeholder="주소" disabled={disabled} />
            {onChangeDetail !== undefined && (
                <Input
                    value={addressDetail}
                    placeholder="상세주소"
                    onChange={onChangeDetail}
                    disabled={disabled}
                />
            )}
            <CustomAddressSearchModal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onAddrSearchComplete={handleComplete}
            />
        </div>
    );
};

export default CustomAddressInput;
