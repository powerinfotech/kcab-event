package com.power.dto.code;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.Valid;
import java.util.List;

/**
 * ComGrpCdSaveDto - 공통 코드 그룹 저장 요청 DTO
 *
 * <p>변경된 코드 그룹 항목 목록을 전달하는 래퍼 DTO.
 * 저장 서비스에서 각 항목의 {@link IudType}에 따라 INSERT / UPDATE를 수행한다.</p>
 *
 * <h3>요청 예시</h3>
 * <pre>
 * {
 *   "comGrpCdList": [
 *     { "comGrpCd": "JOB", "comGrpCdNm": "직종", "useYn": "Y", "iudType": "I" }
 *   ]
 * }
 * </pre>
 *
 * @see com.power.service.code.ComGrpCdService#saveComGrpCd
 */
@Getter
@Setter
public class ComGrpCdSaveDto {
    /** 저장할 공통 코드 그룹 변경 목록 */
    @Valid
    private List<ComGrpCdListDto> comGrpCdList;
}
