package com.miso.lxnn.dto.common;

import com.miso.lxnn.domain.User;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class LoginUser {
    private Integer userSeq;
    private String userId;
    /** tb_user dprt_cd */
    private String dprtCd;
    private String userName;
    private String nickName;
    private String email;
    /** tb_user use_yn (Y/N) */
    private String useYn;
    /** tb_user adm_yn (Y/N) */
    private String admYn;

    public static LoginUser covert(User user) {
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
