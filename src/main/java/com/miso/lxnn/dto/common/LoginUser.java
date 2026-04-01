package com.miso.lxnn.dto.common;

import com.miso.lxnn.domain.User;
import lombok.Getter;
import lombok.Setter;


/**
 * LoginUser - HTTP 세션 저장용 로그인 사용자 DTO
 *
 * <p>로그인 성공 시 {@link com.miso.lxnn.domain.User} 엔티티의 민감 정보(비밀번호 등)를 제외한
 * 핵심 정보만 추출하여 HTTP 세션({@code "user"} 속성)에 저장한다.
 * 컨트롤러에서는 {@link com.miso.lxnn.annotation.MisoSession}을 통해 자동으로 주입받는다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 세션 생성 (로그인 서비스 내부)
 * LoginUser loginUser = LoginUser.convert(user);
 * session.setAttribute("user", loginUser);
 *
 * // 컨트롤러에서 주입받기
 * {@literal @}GetMapping("/api/my-info")
 * public ApiResponse{@literal <}LoginUser{@literal >} getMyInfo({@literal @}MisoSession LoginUser loginUser) {
 *     return ApiResponse.ok(loginUser);
 * }
 * </pre>
 *
 * @see com.miso.lxnn.annotation.MisoSession
 * @see com.miso.lxnn.config.LoginUserArgumentResolver
 */
@Setter
@Getter
public class LoginUser {
    /** 사용자 고유 순번 (tb_user.user_seq) */
    private Integer userSeq;
    /** 로그인 아이디 (tb_user.user_id) */
    private String userId;
    /** 부서 코드 (tb_user.dprt_cd) */
    private String dprtCd;
    /** 사용자 이름 (tb_user.user_nm) */
    private String userName;
    /** 닉네임 (tb_user.nick_nm) */
    private String nickName;
    /** 이메일 주소 (tb_user.email) */
    private String email;
    /** 사용 여부 (tb_user.use_yn — {@code "Y"} / {@code "N"}) */
    private String useYn;
    /** 관리자 여부 (tb_user.adm_yn — {@code "Y"} / {@code "N"}) */
    private String admYn;

    /**
     * {@link User} 엔티티를 {@link LoginUser} 세션 DTO로 변환한다.
     *
     * @param user 변환할 사용자 엔티티
     * @return 세션 저장용 {@link LoginUser}
     */
    public static LoginUser convert(User user) {
        LoginUser loginUser = new LoginUser();
        loginUser.setUserSeq(user.getUserSeq());
        loginUser.setUserId(user.getUserId());
        loginUser.setDprtCd(user.getDprtCd());
        loginUser.setUserName(user.getUserName());
        loginUser.setNickName(user.getNickName());
        loginUser.setEmail(user.getEmail());
        loginUser.setUseYn(user.getUseYn());
        loginUser.setAdmYn(user.getAdmYn());
        return loginUser;
    }
}
