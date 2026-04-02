package com.power.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * ExcelDownloadRequest - 엑셀 다운로드 요청 DTO
 *
 * <p>클라이언트가 엑셀 파일 생성을 요청할 때 파일명, 컬럼 정의, 데이터 목록을 함께 전달한다.
 * {@link com.power.service.common.ExcelService#generateExcel}의 입력값으로 사용된다.</p>
 *
 * <h3>요청 예시</h3>
 * <pre>
 * {
 *   "fileName": "사용자목록",
 *   "columns": [
 *     { "headerName": "사용자명", "dataIndex": "userName", "width": 20 },
 *     { "headerName": "이메일",   "dataIndex": "email",    "width": 30 }
 *   ],
 *   "dataList": [
 *     { "userName": "홍길동", "email": "hong@example.com" }
 *   ]
 * }
 * </pre>
 *
 * @see ExcelColumn
 * @see com.power.service.common.ExcelService
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelDownloadRequest {
    /** 생성할 엑셀 파일명 (확장자 제외) */
    private String fileName;
    /** 컬럼 순서 및 정의 목록 */
    private List<ExcelColumn> columns;
    /** 엑셀 데이터 행 목록 (키: {@link ExcelColumn#getDataIndex()}) */
    private List<Map<String, Object>> dataList;
}
