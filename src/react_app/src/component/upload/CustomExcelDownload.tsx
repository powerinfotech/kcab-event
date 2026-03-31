/**
 * CustomExcelDownload - 엑셀 다운로드 버튼 컴포넌트
 *
 * [목적]
 * 테이블 데이터를 엑셀 파일로 다운로드하는 버튼을 제공한다.
 * callExcelDownload API를 호출하여 서버사이드 엑셀 생성을 처리한다.
 *
 * @param columns     - 엑셀 컬럼 정의 (ExcelColumnDef[]) — 헤더명, 데이터 키 포함
 * @param dataSource  - 다운로드할 데이터 배열
 * @param fileName    - 저장될 파일명 (확장자 제외)
 * @param buttonText  - 버튼 텍스트 (기본: '엑셀 다운로드')
 *
 * [사용 방법]
 * @example
 * import CustomExcelDownload from '@component/upload/CustomExcelDownload';
 *
 * const excelColumns = [
 *   { header: '사용자 ID', key: 'userId' },
 *   { header: '사용자명', key: 'userName' },
 *   { header: '이메일', key: 'email' },
 * ];
 *
 * <CustomExcelDownload
 *   columns={excelColumns}
 *   dataSource={userList}
 *   fileName="사용자목록"
 * />
 *
 * // 버튼 텍스트 변경
 * <CustomExcelDownload
 *   columns={excelColumns}
 *   dataSource={dataSource}
 *   fileName="보고서"
 *   buttonText="보고서 다운로드"
 * />
 */
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
