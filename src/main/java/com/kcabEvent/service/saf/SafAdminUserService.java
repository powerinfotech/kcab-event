package com.kcabEvent.service.saf;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.saf.SafAdminUserDetailDto;
import com.kcabEvent.dto.saf.SafAdminUserListDto;
import com.kcabEvent.dto.saf.SafAdminUserSaveDto;
import com.kcabEvent.dto.saf.SafAdminUserSearchDto;

import java.util.List;

/**
 * SAF 사용자/기관 관리자 서비스.
 *
 * <p>관리자 화면에서 SAF 사용자 목록 조회, 상세 조회, 정보 수정, 가입 승인 기능을 제공한다.</p>
 */
public interface SafAdminUserService {
    /**
     * 검색 조건에 맞는 SAF 사용자와 기관 목록을 조회한다.
     *
     * @param searchDto 검색어, 유형, 상태 조건
     * @return 신청 상태 우선, 관리자 우선 정렬이 적용된 목록
     */
    List<SafAdminUserListDto> selectUserList(SafAdminUserSearchDto searchDto);

    /**
     * 사용자 상세 정보와 연결된 기관 정보를 조회한다.
     *
     * @param userSeq 사용자 고유번호
     * @return 상세 정보
     */
    SafAdminUserDetailDto selectUserDetail(Long userSeq);

    /**
     * 사용자와 연결 기관 정보를 수정한다.
     *
     * @param userSeq 사용자 고유번호
     * @param saveDto 수정 요청 정보
     * @param loginUser 현재 로그인 사용자
     */
    void updateUser(Long userSeq, SafAdminUserSaveDto saveDto, LoginUser loginUser);

    /**
     * 가입 신청 사용자를 승인 상태로 변경한다.
     *
     * @param userSeq 사용자 고유번호
     * @param loginUser 현재 로그인 사용자
     */
    void approveUser(Long userSeq, LoginUser loginUser);
}
