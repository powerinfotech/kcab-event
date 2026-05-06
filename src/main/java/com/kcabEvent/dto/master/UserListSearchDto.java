package com.kcabEvent.dto.master;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 * UserListSearchDto - 사용자 목록 검색 조건 DTO
 *
 * <p>사용자 관리 화면에서 사용자 목록을 조회할 때 필터링 조건을 전달한다.</p>
 *
 * @see com.kcabEvent.dao.UserDao#selectUserList
 */
@Getter
@Setter
@RequiredArgsConstructor
public class UserListSearchDto {
    /** 로그인 아이디 검색어 (부분 일치, {@code null}이면 전체) */
    private String userId;
    /** 사용자 이름 검색어 (부분 일치, {@code null}이면 전체) */
    private String userName;
    /** 체크 여부 필터 (용도에 따라 사용; 기본값 {@code null}이면 무시) */
    private Boolean isCheck;
}
