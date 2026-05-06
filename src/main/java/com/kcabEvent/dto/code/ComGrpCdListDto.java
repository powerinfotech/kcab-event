package com.kcabEvent.dto.code;

import com.kcabEvent.domain.ComGrpCd;
import com.kcabEvent.enums.IudType;
import lombok.Getter;
import lombok.Setter;

/**
 * ComGrpCdListDto - 공통 코드 그룹 목록 DTO
 *
 * <p>{@link com.kcabEvent.domain.ComGrpCd} 엔티티를 상속하고 {@link IudType}을 추가하여
 * 그리드에서 변경된 코드 그룹 행의 상태(I/U)를 서버로 전달한다.
 * (코드 그룹은 삭제를 지원하지 않으므로 {@code D}는 사용하지 않는다.)</p>
 *
 * @see ComGrpCdSaveDto
 */
@Getter
@Setter
public class ComGrpCdListDto extends ComGrpCd {
    /** 행 변경 유형 (I: 추가, U: 수정) */
    private IudType iudType;
}
