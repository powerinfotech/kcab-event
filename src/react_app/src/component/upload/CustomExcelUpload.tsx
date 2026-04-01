/**
 * CustomExcelUpload - 엑셀 파일 업로드 버튼 컴포넌트
 *
 * [목적]
 * 엑셀 파일(.xlsx, .xls)을 업로드하여 데이터를 서버로 전송한다.
 * callExcelUpload API를 호출하여 파싱된 데이터를 onUploadSuccess로 전달한다.
 *
 * @param columns          - 엑셀 컬럼 정의 (ExcelColumnDef[]) — 파싱 기준 컬럼
 * @param onUploadSuccess  - 업로드 성공 시 파싱된 데이터 배열 전달 콜백
 * @param buttonText       - 버튼 텍스트 (기본: '엑셀 업로드')
 *
 * [사용 방법]
 * @example
 * import CustomExcelUpload from '@component/upload/CustomExcelUpload';
 *
 * const excelColumns: ExcelColumnDef[] = [
 *   { headerName: '사용자 ID', dataIndex: 'userId' },
 *   { headerName: '사용자명', dataIndex: 'userName' },
 * ];
 *
 * <CustomExcelUpload
 *   columns={excelColumns}
 *   onUploadSuccess={(data) => {
 *     console.log('업로드 데이터:', data);
 *     setUserList(data);
 *   }}
 * />
 */
import React from 'react';
import {Upload, message} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import CustomButton from '@component/button/CustomButton';
import {callExcelUpload, ExcelColumnDef} from '@api/CommonExcelApi';

interface CustomExcelUploadProps {
    columns: ExcelColumnDef[];
    onUploadSuccess?: (data: any[]) => void;
    buttonText?: string;
}

const CustomExcelUpload = ({columns, onUploadSuccess, buttonText = '엑셀 업로드'}: CustomExcelUploadProps) => {

    const handleBeforeUpload = async (file: File) => {
        try {
            const response = await callExcelUpload(file, columns);
            if (response.item) {
                onUploadSuccess?.(response.item);
                message.success(`${response.item.length}건의 데이터를 업로드했습니다.`);
            }
        } catch (e) {
            message.error('엑셀 업로드 중 오류가 발생했습니다.');
        }
        return false;
    };

    return (
        <Upload
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
        >
            <CustomButton icon={<UploadOutlined />}>{buttonText}</CustomButton>
        </Upload>
    );
};

export default CustomExcelUpload;
