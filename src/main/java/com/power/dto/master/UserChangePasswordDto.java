package com.power.dto.master;

import com.power.domain.User;
import com.power.dto.common.LoginUser;
import com.power.util.CryptoUtil;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;


/**
 * UserChangePasswordDto - 비밀번호 변경 요청 DTO
 *
 * <p>관리자 또는 사용자 본인이 비밀번호를 변경할 때 사용한다.
 * {@link #from} 정적 팩토리 메서드로 {@link User} 엔티티로 변환한 뒤 DB에 반영한다.</p>
 *
 * <h3>요청 예시</h3>
 * <pre>
 * { "userSeq": 1, "userId": "admin", "password": "NewP@ss1!" }
 * </pre>
 *
 * @see com.power.service.master.UserManagementService#changePassword
 */
@Getter
@Setter
public class UserChangePasswordDto {
    /** 사용자 고유 순번 (필수) */
    @NotNull
    private Integer userSeq;
    /** 로그인 아이디 */
    private String userId;
    /** 새 비밀번호 평문 (필수, BCrypt 해시 변환 후 저장) */
    @NotEmpty
    private String password;
    /** 비밀번호 초기 설정 완료 여부 플래그 */
    private Boolean passwordSetFlag;

    /**
     * {@link UserChangePasswordDto}를 비밀번호 변경용 {@link User} 엔티티로 변환한다.
     * 비밀번호는 BCrypt로 해시화된다.
     *
     * @param userChangePasswordDto 비밀번호 변경 요청 DTO
     * @param LoginUser             현재 로그인 사용자 (수정자 정보 설정에 사용)
     * @return 비밀번호 업데이트용 {@link User} 엔티티
     */
    public static User from(UserChangePasswordDto userChangePasswordDto, LoginUser LoginUser) {
        User user = new User();
        user.setUserSeq(userChangePasswordDto.getUserSeq());
        user.setUserId(userChangePasswordDto.getUserId());
        user.setPassword(CryptoUtil.encodePassword(userChangePasswordDto.getPassword()));
        user.setUptUserSeq(LoginUser.getUserSeq());
        return user;
    }
}
