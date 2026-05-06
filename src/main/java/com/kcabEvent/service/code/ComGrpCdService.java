package com.kcabEvent.service.code;

import com.kcabEvent.dto.code.ComGrpCdListDto;
import com.kcabEvent.dto.code.ComGrpCdSaveDto;
import com.kcabEvent.dto.common.LoginUser;

import jakarta.validation.Valid;
import java.util.List;

/**
 * ComGrpCdService - 공통 코드 그룹 서비스 인터페이스
 *
 * <p>공통 코드 그룹(tb_com_grp_cd)의 조회 및 일괄 저장(I/U) 기능을 제공한다.
 * 코드 그룹은 삭제를 지원하지 않는다.</p>
 *
 * @see com.kcabEvent.service.code.impl.ComGrpCdServiceImpl
 */
public interface ComGrpCdService {
    /**
     * 공통 코드 그룹 목록을 조회한다.
     *
     * @param searchText 그룹명 검색어 ({@code null}이면 전체)
     */
    List<ComGrpCdListDto> selectComGrpCdList(String searchText, String useYn);
    /**
     * 공통 코드 그룹을 일괄 저장한다 (트랜잭션).
     *
     * @param saveDto   변경 목록이 담긴 저장 DTO
     * @param loginUser 현재 로그인 사용자 (등록자·수정자 설정에 사용)
     */
    void saveComGrpCd(@Valid ComGrpCdSaveDto saveDto, LoginUser loginUser);
}
