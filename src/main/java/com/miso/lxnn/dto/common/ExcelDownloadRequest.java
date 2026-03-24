package com.miso.lxnn.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelDownloadRequest {
    private String fileName;
    private List<ExcelColumn> columns;
    private List<Map<String, Object>> dataList;
}
