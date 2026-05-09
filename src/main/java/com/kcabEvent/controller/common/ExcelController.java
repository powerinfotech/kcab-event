package com.kcabEvent.controller.common;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.ExcelColumn;
import com.kcabEvent.dto.common.ExcelDownloadRequest;
import com.kcabEvent.service.common.ExcelService;
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

/**
 * 그리드 화면에서 사용하는 엑셀 가져오기/내보내기 API를 제공한다.
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/excel")
public class ExcelController {

    private final ExcelService excelService;
    private final ObjectMapper objectMapper;

    /**
     * 클라이언트가 전달한 컬럼과 행 데이터로 엑셀 파일을 생성해 다운로드한다.
     */
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

    /**
     * 클라이언트가 전달한 컬럼 메타데이터에 따라 업로드된 엑셀 파일을 파싱한다.
     */
    @PostMapping("/upload")
    public ApiResponse<List<Map<String, Object>>> uploadExcel(
            @RequestPart("file") MultipartFile file,
            @RequestParam("columns") String columnsJson) throws com.fasterxml.jackson.core.JsonProcessingException {

        if (file.isEmpty()) {
            throw new com.kcabEvent.exception.custom.ValidationException("파일이 비어있습니다.");
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || (!originalFilename.endsWith(".xlsx") && !originalFilename.endsWith(".xls"))) {
            throw new com.kcabEvent.exception.custom.ValidationException("엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.");
        }

        List<ExcelColumn> columns = objectMapper.readValue(columnsJson, new TypeReference<List<ExcelColumn>>() {});
        List<Map<String, Object>> result = excelService.parseExcel(file, columns);
        return ApiResponse.ok(result);
    }
}
