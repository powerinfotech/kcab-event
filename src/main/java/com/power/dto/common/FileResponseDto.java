package com.power.dto.common;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * FileResponseDto - 파일 목록 응답 DTO
 *
 * <p>파일 그룹 순번({@code fileSeq})과 해당 그룹에 속한 파일 상세 목록을 함께 반환한다.</p>
 *
 * <h3>응답 예시</h3>
 * <pre>
 * {
 *   "fileSeq": 101,
 *   "fileList": [
 *     { "fileDtlSeq": 1, "fileNm": "report.pdf", "fileType": "pdf", ... },
 *     { "fileDtlSeq": 2, "fileNm": "image.png",  "fileType": "png", ... }
 *   ]
 * }
 * </pre>
 *
 * @see com.power.controller.FileController
 */
@Getter
@Setter
public class FileResponseDto {
    /** 파일 그룹 순번 (tb_file.file_seq) */
    private Integer fileSeq;
    /** 파일 그룹에 속한 개별 파일 상세 목록 */
    private List<FileDetailDto> fileList;
}
