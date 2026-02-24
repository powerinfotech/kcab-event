package com.miso.lxnn.dto.master;

import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.util.CryptoUtil;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;


@Getter
@Setter
public class UserChangePasswordDto {
    @NotNull
    private Integer userSeq;
    private String userId;
    @NotEmpty
    private String password;
    private Boolean passwordSetFlag;

    public static User from(UserChangePasswordDto userChangePasswordDto, LoginUser LoginUser) {
        User user = new User();
        user.setUserSeq(userChangePasswordDto.getUserSeq());
        user.setUserId(userChangePasswordDto.getUserId());
        user.setPassword(CryptoUtil.encodePassword(userChangePasswordDto.getPassword()));
        user.setUptUserSeq(LoginUser.getUserSeq());
        return user;
    }
}
