package com.miso.lxnn.dto.common;

import com.miso.lxnn.domain.User;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class LoginUser {
    private Integer userSeq;
    private String userId;
    private String deptCd;
    private String userName;
    private String nickName;
    private String email;
    private Boolean useFlag;
    private Boolean admFlag;
    private String salt;

    public static LoginUser covert(User user) {
        LoginUser loginUser = new LoginUser();
        loginUser.setUserSeq(user.getUserSeq());
        loginUser.setUserId(user.getUserId());
        loginUser.setDeptCd(user.getDeptCd());
        loginUser.setUserName(user.getUserName());
        loginUser.setNickName(user.getNickName());
        loginUser.setEmail(user.getEmail());
        loginUser.setAdmFlag(user.getAdmFlag());
        loginUser.setUseFlag(user.getUseFlag());
        return loginUser;
    }
}
