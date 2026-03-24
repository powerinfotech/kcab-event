package com.miso.lxnn.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelColumn {
    private String headerName;
    private String dataIndex;
    private Integer width;
}
