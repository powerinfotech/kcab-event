import axios from 'axios';
import {ApiResponse} from '@interface/common';

export interface ExcelColumnDef {
    headerName: string;
    dataIndex: string;
    width?: number;
}

export const callExcelDownload = async (columns: ExcelColumnDef[], dataList: any[], fileName: string) => {
    const response = await axios.post('/api/excel/download', {
        columns,
        dataList,
        fileName,
    }, {
        responseType: 'blob',
    });

    const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const callExcelUpload = async (file: File, columns: ExcelColumnDef[]) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('columns', JSON.stringify(columns));

    const {data} = await axios.post<ApiResponse<any[]>>('/api/excel/upload', formData);
    return data;
};
