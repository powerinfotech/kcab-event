package com.power.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ExcelColumn - 엑셀 컬럼 정의 DTO
 *
 * <p>엑셀 생성·파싱 시 컬럼 헤더명, 데이터 키, 열 너비를 정의한다.
 * {@link com.power.dto.common.ExcelDownloadRequest}의 컬럼 목록으로 사용된다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * List{@literal <}ExcelColumn{@literal >} columns = List.of(
 *     new ExcelColumn("사용자명", "userName", 20),
 *     new ExcelColumn("이메일",   "email",    30)
 * );
 * </pre>
 *
 * @see ExcelDownloadRequest
 * @see com.power.service.common.ExcelService
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelColumn {
    /** 엑셀 헤더 행에 표시할 컬럼명 */
    private String headerName;
    /** 데이터 행에서 값을 읽을 Map 키 (또는 DTO 필드명) */
    private String dataIndex;
    /** 열 너비 (엑셀 문자 단위, {@code null}이면 15 적용) */
    private Integer width;
}
