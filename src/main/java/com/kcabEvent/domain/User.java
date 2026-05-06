package com.kcabEvent.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class User {
    private Integer userSeq;
    @NotEmpty
    private String userId;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
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
    /** tb_user dprt_cd */
    private String dprtCd;
    @NotEmpty
    private String email;
    @NotNull
    @JsonFormat(pattern = "yyyyMMdd")
    private String strDate;
    @JsonFormat(pattern = "yyyyMMdd")
    private String endDate;
    private LocalDateTime loginDateTime;
    /** tb_user use_yn (Y/N) */
    private String useYn;
    /** tb_user adm_yn (Y/N) */
    private String admYn;
    private Integer rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Integer uptUserSeq;
    private LocalDateTime uptDateTime;
    private Boolean passwordSetFlag;

    /** 호환용: use_yn = 'Y' 여부 */
    public Boolean getUseFlag() {
        return "Y".equals(useYn);
    }

    /** 호환용: adm_yn = 'Y' 여부 */
    public Boolean getAdmFlag() {
        return "Y".equals(admYn);
    }
}
