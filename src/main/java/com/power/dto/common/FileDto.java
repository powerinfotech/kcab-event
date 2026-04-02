package com.power.dto.common;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * FileDto - 파일 그룹 기본 DTO
 *
 * <p>파일 그룹(tb_file) 테이블의 공통 감사(Audit) 필드를 포함하는 기반 클래스.
 * {@link FileDetailDto}가 이 클래스를 상속하여 파일 상세 정보를 추가한다.</p>
 *
 * @see FileDetailDto
 */
@Getter
@Setter
public class FileDto {
    /** 파일 그룹 순번 (tb_file.file_seq) */
    private Integer fileSeq;
    /** 연결된 메뉴 순번 (tb_file.menu_seq) */
    private Integer menuSeq;
    /** 등록자 사용자 순번 */
    private Integer rgstUserSeq;
    /** 등록 일시 */
    private LocalDateTime rgstDateTime;
    /** 수정자 사용자 순번 */
    private Integer uptUserSeq;
    /** 수정 일시 */
    private LocalDateTime uptDateTime;
}
