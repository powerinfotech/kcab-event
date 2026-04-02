package com.miso.lxnn.service.code;

import com.miso.lxnn.dto.code.ComCdListDto;
import com.miso.lxnn.dto.code.ComCdSaveDto;
import com.miso.lxnn.dto.common.LoginUser;

import jakarta.validation.Valid;
import java.util.List;

/**
 * ComCdService - 공통 코드 서비스 인터페이스
 *
 * <p>공통 코드(tb_com_cd)의 조회 및 일괄 저장(I/U/D) 기능을 제공한다.</p>
 *
 * @see com.miso.lxnn.service.code.impl.ComCdServiceImpl
 */
public interface ComCdService {
    /**
     * 코드 그룹에 속한 공통 코드 목록을 조회한다.
     *
     * @param comGrpCdSeq 코드 그룹 순번
     */
    List<ComCdListDto> selectComCdList(Long comGrpCdSeq) throws Exception;
    /**
     * 공통 코드를 일괄 저장한다 (트랜잭션).
     *
     * @param saveDto   변경 목록이 담긴 저장 DTO
     * @param loginUser 현재 로그인 사용자 (등록자·수정자 설정에 사용)
     */
    void saveComCd(@Valid ComCdSaveDto saveDto, LoginUser loginUser) throws Exception;
}
