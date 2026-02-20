package com.miso.lxnn.dto.master;

import lombok.Data;

import java.time.LocalDate;

@Data
public class NoticeListDto {
    private Integer noticeSeq;
    private Integer viewCnt;
    private Integer fileSeq;

    private Boolean popupFlag;
    private Boolean fixFlag;
    private Boolean useFlag;

    private LocalDate strDate;
    private LocalDate endDate;


    private String ctgrCd;
    private String title;
    private String content;
    private String rgstUserId;
    private String rgstDateTime;
    private String uptUserId;
    private String uptDateTime;
    private String rgstUserNm;
    private String ctgrNm;
    private String popupFlagLabel;
    private String fixFlagLabel;


    public Boolean getUseFlag() {
        if(this.useFlag == null||!this.useFlag)
            return false;

        LocalDate now = LocalDate.now();


        if (this.strDate == null) {
            return false;
        }

        if (this.strDate.isBefore(now.plusDays(1))) {
            if (this.endDate == null || this.endDate.isAfter(now.minusDays(1))) {
                return true;
            }
        }
        return false;
    }
}
