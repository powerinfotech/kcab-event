package com.miso.lxnn.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.miso.lxnn.domain.Menu;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Getter
@Setter
public class MenuListDto extends Menu {
    private String menuNamePath;
    private String menuIdPath;
    private Integer level;
    private String rgstUserName;
    private String uptUserName;
    private String rgstDate;
    private String uptDate;

    @JsonIgnore
    private LocalDateTime rgstDateTime;

    @JsonIgnore
    private LocalDateTime uptDateTime;

    public String getRgstDate() {
        return rgstDateTime != null ? rgstDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null;
    }

    public String getUptDate() {
        return uptDateTime !=null ?uptDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null;
    }


}
