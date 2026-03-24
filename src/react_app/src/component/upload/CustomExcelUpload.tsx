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
