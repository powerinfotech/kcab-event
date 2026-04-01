package com.miso.lxnn.dto.common;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * FileDetailDto - 파일 상세 DTO
 *
 * <p>파일 상세(tb_file_dtl) 테이블의 개별 파일 정보를 담는다.
 * {@link FileDto}를 상속하므로 그룹 감사 필드도 함께 포함된다.</p>
 *
 * <h3>응답 예시</h3>
 * <pre>
 * {
 *   "fileDtlSeq": 5,
 *   "fileSeq": 101,
 *   "fileNm": "report.pdf",
 *   "filePath": "/upload/abc123_report.pdf",
 *   "fileType": "pdf",
 *   "delYn": "N",
 *   "sortSeq": 1
 * }
 * </pre>
 *
 * @see com.miso.lxnn.dao.FileDao
 */
@Getter
@Setter
public class FileDetailDto extends FileDto{
    /** 파일 상세 고유 순번 (tb_file_dtl.file_dtl_seq) */
    private Integer fileDtlSeq;
    /** 파일 그룹 순번 (tb_file_dtl.file_seq) */
    private Integer fileSeq;
    /** 원본 파일명 */
    private String fileNm;
    /** 서버 저장 경로 (UUID 포함 전체 경로) */
    private String filePath;
    /** 파일 확장자 (예: {@code "pdf"}, {@code "png"}) */
    private String fileType;
    /** 삭제 여부 ({@code "Y"} / {@code "N"}) */
    private String delYn;
    /** 파일 정렬 순서 */
    private Integer sortSeq;
}
