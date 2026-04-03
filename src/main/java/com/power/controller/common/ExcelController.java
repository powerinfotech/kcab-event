package com.power.controller.common;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.power.dto.common.ApiResponse;
import com.power.dto.common.ExcelColumn;
import com.power.dto.common.ExcelDownloadRequest;
import com.power.service.common.ExcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/excel")
public class ExcelController {

    private final ExcelService excelService;
    private final ObjectMapper objectMapper;

    @PostMapping("/download")
    public ResponseEntity<byte[]> downloadExcel(@RequestBody ExcelDownloadRequest request) {
        byte[] excelData = excelService.generateExcel(request.getColumns(), request.getDataList());

        String fileName = request.getFileName() != null ? request.getFileName() : "export";
        String encodedFileName = URLEncoder.encode(fileName + ".xlsx", StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelData);
    }

    @PostMapping("/upload")
    public ApiResponse<List<Map<String, Object>>> uploadExcel(
            @RequestPart("file") MultipartFile file,
            @RequestParam("columns") String columnsJson) throws com.fasterxml.jackson.core.JsonProcessingException {

        if (file.isEmpty()) {
            throw new com.power.exception.custom.ValidationException("파일이 비어있습니다.");
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || (!originalFilename.endsWith(".xlsx") && !originalFilename.endsWith(".xls"))) {
            throw new com.power.exception.custom.ValidationException("엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.");
        }

        List<ExcelColumn> columns = objectMapper.readValue(columnsJson, new TypeReference<List<ExcelColumn>>() {});
        List<Map<String, Object>> result = excelService.parseExcel(file, columns);
        return ApiResponse.ok(result);
    }
}
