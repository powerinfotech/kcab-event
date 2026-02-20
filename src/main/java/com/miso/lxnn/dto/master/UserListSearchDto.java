package com.miso.lxnn.dto.master;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserListSearchDto {
    private String userId;
    private String userName;
    private Boolean isCheck;
}
