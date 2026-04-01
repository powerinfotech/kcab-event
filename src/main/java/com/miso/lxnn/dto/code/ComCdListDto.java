package com.miso.lxnn.dto.code;

import com.miso.lxnn.domain.ComCd;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

/**
 * ComCdListDto - 공통 코드 목록 DTO
 *
 * <p>{@link com.miso.lxnn.domain.ComCd} 엔티티를 상속하고 {@link IudType}을 추가하여
 * 그리드에서 변경된 코드 행의 상태(I/U/D)를 서버로 전달한다.</p>
 *
 * @see ComCdSaveDto
 */
@Getter
@Setter
public class ComCdListDto extends ComCd {
    /** 행 변경 유형 (I: 추가, U: 수정, D: 삭제) */
    private IudType iudType;
}
