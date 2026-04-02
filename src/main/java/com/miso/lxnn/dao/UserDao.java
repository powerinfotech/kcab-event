package com.miso.lxnn.dao;

import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginRequestDto;
import com.miso.lxnn.dto.master.UserComboListDto;
import com.miso.lxnn.dto.master.UserListDto;
import com.miso.lxnn.dto.master.UserListSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

/**
 * UserDao - 사용자 MyBatis 매퍼 인터페이스
 *
 * <p>사용자(tb_user) 테이블의 CRUD 및 로그인 관련 조회를 담당한다.</p>
 *
 * @see com.miso.lxnn.service.master.UserManagementService
 * @see com.miso.lxnn.service.common.LoginService
 */
@EgovMapper("userDao")
public interface UserDao {
    /**
     * 아이디로 사용자 정보를 조회한다 (비밀번호 포함).
     *
     * @param userId 로그인 아이디
     * @return 사용자 엔티티, 없으면 {@code null}
     */
    User selectUser(@Param("userId") String userId) throws Exception;
    /**
     * 로그인 아이디·비밀번호 일치 여부를 확인한다.
     *
     * @param loginRequestDto 로그인 요청 DTO
     * @return 일치하면 양수, 불일치하면 0
     */
    Integer selectUserLoginCheck(LoginRequestDto loginRequestDto) throws Exception;
    /** 검색 조건에 맞는 사용자 목록을 조회한다. */
    List<UserListDto> selectUserList(UserListSearchDto param) throws Exception;
    /**
     * 콤보박스용 사용자 목록을 조회한다.
     *
     * @param searchText 아이디 또는 이름 검색어 ({@code null}이면 전체)
     */
    List<UserComboListDto> selectUserComboList(@Param("searchText") String searchText) throws Exception;
    /**
     * 아이디 중복 여부를 확인한다.
     *
     * @param userId 검사할 로그인 아이디
     * @return 이미 존재하면 {@code true}
     */
    Boolean selectUserIdValidation(@Param("userId") String userId) throws Exception;
    /** 사용자를 등록한다. */
    void insertUser(User user) throws Exception;
    /** 사용자 정보를 수정한다. */
    void updateUser(User user) throws Exception;
    /** 사용자를 삭제한다. */
    void deleteUser(User user) throws Exception;
    /** 비밀번호를 변경한다. */
    void updatePassword(User user) throws Exception;
    /** 최종 로그인 일시를 현재 시각으로 갱신한다. */
    void updateLoginDateTime(@Param("userSeq") Long userSeq) throws Exception;
}