package com.miso.lxnn.dto.code;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.List;

/**
 * ComCdSaveDto - 공통 코드 저장 요청 DTO
 *
 * <p>코드 그룹 식별자와 변경된 코드 항목 목록을 함께 전달한다.
 * 저장 서비스에서 각 항목의 {@link IudType}에 따라 INSERT / UPDATE / DELETE를 수행한다.</p>
 *
 * <h3>요청 예시</h3>
 * <pre>
 * {
 *   "comGrpCdSeq": 5,
 *   "comGrpCd": "SEX",
 *   "comCdList": [
 *     { "comCd": "03", "comCdNm": "기타", "useYn": "Y", "iudType": "I" }
 *   ]
 * }
 * </pre>
 *
 * @see com.miso.lxnn.service.code.ComCdService#saveComCd
 */
@Getter
@Setter
public class ComCdSaveDto {
    /** 코드 그룹 고유 순번 */
    private Long comGrpCdSeq;
    /** 코드 그룹 코드 값 (신규 코드의 {@code comStdCd} 접두어로 사용) */
    private String comGrpCd;
    /** 저장할 공통 코드 변경 목록 */
    @Valid
    private List<ComCdListDto> comCdList;
}
