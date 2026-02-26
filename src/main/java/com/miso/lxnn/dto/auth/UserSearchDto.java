package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSearchDto {
    private Integer userSeq;
    private String userId;
    private String userName;
}
