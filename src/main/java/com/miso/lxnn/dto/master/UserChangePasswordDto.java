package com.miso.lxnn.dto.master;

import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.util.CryptoUtil;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.security.NoSuchAlgorithmException;


@Getter
@Setter
public class UserChangePasswordDto {
    @NotNull
    private Integer userSeq;
    private String userId;
    @NotEmpty
    private String passwd;
    private String salt;
    private Boolean passwdSetFlag;
    private String uptUserId;

    public static User from(UserChangePasswordDto userChangePasswordDto, LoginUser LoginUser) throws NoSuchAlgorithmException {
        User user = new User();
        user.setUserSeq(userChangePasswordDto.getUserSeq());
        user.setUserId(userChangePasswordDto.getUserId());
        user.setPasswd(CryptoUtil.encryptSha256(userChangePasswordDto.getPasswd(), userChangePasswordDto.getSalt()));
        user.setUptUserId(LoginUser.getUserId());
        return user;
    }
}
