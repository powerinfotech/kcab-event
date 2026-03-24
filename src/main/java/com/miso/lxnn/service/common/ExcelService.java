package com.miso.lxnn.service.common;

import com.miso.lxnn.dto.common.ExcelColumn;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ExcelService {
    byte[] generateExcel(List<ExcelColumn> columns, List<Map<String, Object>> dataList) throws Exception;
    List<Map<String, Object>> parseExcel(MultipartFile file, List<ExcelColumn> columns) throws Exception;
}
