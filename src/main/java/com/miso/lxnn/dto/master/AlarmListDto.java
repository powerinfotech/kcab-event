package com.miso.lxnn.dto.master;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AlarmListDto {
    private String alarmText1;
    private String alarmText2;
    private Integer alarmCnt;
    private Integer snsrAlrmSeq;
    private String readCls;
    private String iconCls;
    private String iconImg;
    private Boolean chkFlag;
}
