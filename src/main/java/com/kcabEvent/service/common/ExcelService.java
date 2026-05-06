package com.kcabEvent.service.common;

import com.kcabEvent.dto.common.ExcelColumn;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * ExcelService - 엑셀 생성·파싱 서비스 인터페이스
 *
 * <p>Apache POI 기반의 엑셀 파일 생성(다운로드)과 파싱(업로드) 기능을 제공한다.</p>
 *
 * @see com.kcabEvent.service.common.impl.ExcelServiceImpl
 */
public interface ExcelService {
    /**
     * 컬럼 정의와 데이터를 기반으로 엑셀 파일 바이트 배열을 생성한다.
     *
     * @param columns  컬럼 정의 목록 (헤더명·데이터키·너비)
     * @param dataList 행 데이터 목록 (키: {@link ExcelColumn#getDataIndex()})
     * @return xlsx 형식의 엑셀 파일 바이트 배열
     */
    byte[] generateExcel(List<ExcelColumn> columns, List<Map<String, Object>> dataList);

    /**
     * 엑셀 파일을 파싱하여 행 데이터 목록으로 변환한다.
     * 첫 번째 행(헤더)은 건너뛰고 2행부터 읽는다.
     *
     * @param file    업로드된 엑셀 파일 (xlsx / xls 모두 지원)
     * @param columns 컬럼 정의 목록 (순서대로 Map 키로 매핑)
     * @return 행 데이터 목록 (키: {@link ExcelColumn#getDataIndex()})
     */
    List<Map<String, Object>> parseExcel(MultipartFile file, List<ExcelColumn> columns);
}
