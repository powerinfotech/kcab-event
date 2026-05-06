package com.kcabEvent.service.master;

import com.kcabEvent.domain.User;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.master.*;

import java.util.List;

/**
 * UserManagementService - 사용자 관리 서비스 인터페이스
 *
 * <p>사용자 목록 조회, 등록·수정·삭제, 비밀번호 변경 기능을 제공한다.</p>
 *
 * @see com.kcabEvent.service.master.impl.UserManagementServiceImpl
 * @see com.kcabEvent.controller.UserManagementController
 */
public interface UserManagementService {
    /**
     * 아이디로 사용자 정보를 조회한다.
     *
     * @param userId 로그인 아이디
     */
    User selectUserInfo(String userId);
    /**
     * 검색 조건에 맞는 사용자 목록을 조회한다.
     *
     * @param param 검색 조건 DTO
     */
    List<UserListDto> selectUserList(UserListSearchDto param);
    /**
     * 콤보박스용 사용자 목록을 조회한다.
     *
     * @param searchText 아이디·이름 검색어
     */
    List<UserComboListDto> selectUserComboList(String searchText);
    /**
     * 사용자를 등록({@code I}) 또는 수정({@code U})한다.
     * 등록 시 아이디 중복 여부와 비밀번호 입력 여부를 검증한다.
     *
     * @param user      저장 요청 DTO
     * @param LoginUser 현재 로그인 사용자 (등록자·수정자 설정에 사용)
     */
    void saveUser(UserSaveDto user, LoginUser LoginUser);
    /**
     * 사용자를 삭제한다.
     *
     * @param user      삭제할 사용자 정보
     * @param LoginUser 현재 로그인 사용자
     */
    void deleteUser(User user, LoginUser LoginUser);
    /**
     * 비밀번호를 변경한다.
     *
     * @param user      비밀번호 변경 요청 DTO
     * @param LoginUser 현재 로그인 사용자 (수정자 설정에 사용)
     */
    void changePassword(UserChangePasswordDto user, LoginUser LoginUser);
}
