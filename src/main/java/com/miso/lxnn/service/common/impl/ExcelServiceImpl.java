package com.miso.lxnn.service.common.impl;

import com.miso.lxnn.dto.common.ExcelColumn;
import com.miso.lxnn.service.common.ExcelService;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service("excelService")
public class ExcelServiceImpl implements ExcelService {

    @Override
    public byte[] generateExcel(List<ExcelColumn> columns, List<Map<String, Object>> dataList) throws Exception {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Sheet1");

            // 헤더 스타일
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            // 데이터 스타일
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);

            // 헤더 행
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.size(); i++) {
                ExcelColumn col = columns.get(i);
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(col.getHeaderName());
                cell.setCellStyle(headerStyle);

                int width = col.getWidth() != null ? col.getWidth() : 15;
                sheet.setColumnWidth(i, width * 256);
            }

            // 데이터 행
            if (dataList != null) {
                for (int rowIdx = 0; rowIdx < dataList.size(); rowIdx++) {
                    Row row = sheet.createRow(rowIdx + 1);
                    Map<String, Object> rowData = dataList.get(rowIdx);

                    for (int colIdx = 0; colIdx < columns.size(); colIdx++) {
                        Cell cell = row.createCell(colIdx);
                        Object value = rowData.get(columns.get(colIdx).getDataIndex());
                        setCellValue(cell, value);
                        cell.setCellStyle(dataStyle);
                    }
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    @Override
    public List<Map<String, Object>> parseExcel(MultipartFile file, List<ExcelColumn> columns) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int rowIdx = 1; rowIdx <= sheet.getLastRowNum(); rowIdx++) {
                Row row = sheet.getRow(rowIdx);
                if (row == null) continue;

                Map<String, Object> rowData = new LinkedHashMap<>();
                for (int colIdx = 0; colIdx < columns.size(); colIdx++) {
                    Cell cell = row.getCell(colIdx);
                    rowData.put(columns.get(colIdx).getDataIndex(), getCellValue(cell));
                }
                result.add(rowData);
            }
        }

        return result;
    }

    private void setCellValue(Cell cell, Object value) {
        if (value == null) {
            cell.setCellValue("");
        } else if (value instanceof Number) {
            cell.setCellValue(((Number) value).doubleValue());
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue(String.valueOf(value));
        }
    }

    private Object getCellValue(Cell cell) {
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    return sdf.format(cell.getDateCellValue());
                }
                double numVal = cell.getNumericCellValue();
                if (numVal == Math.floor(numVal) && !Double.isInfinite(numVal)) {
                    return (long) numVal;
                }
                return numVal;
            case STRING:
                return cell.getStringCellValue();
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case FORMULA:
                try {
                    return cell.getStringCellValue();
                } catch (Exception e) {
                    return cell.getNumericCellValue();
                }
            case BLANK:
                return "";
            default:
                return "";
        }
    }
}
