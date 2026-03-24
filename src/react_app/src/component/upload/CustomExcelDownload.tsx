import React from 'react';
import {message} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import CustomButton from '@component/button/CustomButton';
import {callExcelDownload, ExcelColumnDef} from '@api/CommonExcelApi';

interface CustomExcelDownloadProps {
    columns: ExcelColumnDef[];
    dataSource: any[];
    fileName: string;
    buttonText?: string;
}

const CustomExcelDownload = ({columns, dataSource, fileName, buttonText = '엑셀 다운로드'}: CustomExcelDownloadProps) => {

    const handleDownload = async () => {
        try {
            await callExcelDownload(columns, dataSource, fileName);
            message.success('엑셀 다운로드가 완료되었습니다.');
        } catch (e) {
            message.error('엑셀 다운로드 중 오류가 발생했습니다.');
        }
    };

    return (
        <CustomButton type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
            {buttonText}
        </CustomButton>
    );
};

export default CustomExcelDownload;
