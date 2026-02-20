package com.miso.lxnn.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class User {
    private Integer userSeq;
    @NotEmpty
    private String userId;
    @JsonIgnore
    private String passwd;
    @JsonIgnore
    private String salt;
    @NotEmpty
    private String userName;
    @NotEmpty
    private String userNameEng;
    private String nickName;
    @NotEmpty
    private String userCd;
    private String telNo;
    @NotEmpty
    private String hpNo;
    private String deptCd;
    @NotEmpty
    private String email;
    private String workCd;
    @NotNull
    private LocalDate strDate;
    private LocalDate endDate;
    private LocalDateTime loginDateTime;
    private Boolean useFlag;
    private Boolean admFlag;
    private String rgstUserId;
    private LocalDateTime rgstDateTime;
    private String uptUserId;
    private LocalDateTime uptDateTime;
    private Boolean passwdSetFlag;

}
