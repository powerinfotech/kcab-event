package com.power.service.common.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.power.dao.FileDao;
import com.power.dto.common.FileDetailDto;
import com.power.dto.common.LoginUser;
import com.power.service.common.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * FileServiceImpl - {@link FileService} 구현체
 *
 * <p>파일 처리 흐름:</p>
 * <ul>
 *   <li><b>업로드</b>: UUID 파일명으로 {@code ${file.path.dir}} 하위에 저장 → DB 등록</li>
 *   <li><b>다운로드</b>: 경로 탈출({@code ..}) 방지 후 {@link org.springframework.core.io.UrlResource}로 스트리밍</li>
 *   <li><b>삭제</b>: 파일 서버에서 실제 삭제하지 않고 DB에서만 논리 삭제 (파일 보존 정책)</li>
 * </ul>
 */
@Slf4j
@Service("fileService")
public class FileServiceImpl implements FileService {

    @Resource(name="fileDao")
    private FileDao fileDao;

    private final ObjectMapper objectMapper;

    @Value("${file.path.dir}")
    private String uploadDir;

    public FileServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public List<FileDetailDto> getFileList(Integer fileSeq){
        return fileDao.selectFile(fileSeq);
    }

    @Override
    public Integer addFile(LoginUser loginUser, String insertFileMetaListJson, List<MultipartFile> insertFiles) {
        if(insertFiles == null) return null;

        List<FileDetailDto> insertFileMetaList;
        try {
            insertFileMetaList = objectMapper.readValue(
                    insertFileMetaListJson,
                    new TypeReference<List<FileDetailDto>>() {}
            );
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("파일 메타 JSON 파싱 실패", e);
        }

        List<FileDetailDto> insertFileDtlList = new ArrayList<>();

        insertFiles.forEach((file) -> {
            String originalFileName = file.getOriginalFilename();
            String extension = "";

            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            }

            String savedFileName = UUID.randomUUID().toString() + "_" + originalFileName;

            String filePath = uploadDir + File.separator + savedFileName;
            try {
                // 폴더 없을시 폴더 생성
                File destinationFile = new File(filePath);
                File parentDir = destinationFile.getParentFile();
                if (!parentDir.exists()) {
                    boolean created = parentDir.mkdirs();
                    if (!created) {
                        throw new IOException("업로드 디렉토리 생성 실패: " + parentDir.getAbsolutePath());
                    }
                }

                // 파일전송
                file.transferTo(destinationFile);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            FileDetailDto fileMeta = insertFileMetaList.stream()
                    .filter(m -> m.getFileNm().equals(originalFileName))
                    .findFirst()
                    .orElse(null);

            /* tb_file_dtl 테이블에 insert하기 위한 dto 생성 */
            FileDetailDto insertFileDtl = new FileDetailDto();

            if (fileMeta == null) {
                throw new com.power.exception.custom.BusinessException("파일 메타데이터를 찾을 수 없습니다: " + originalFileName);
            }
            insertFileDtl.setFileSeq(fileMeta.getFileSeq());
            insertFileDtl.setMenuSeq(fileMeta.getMenuSeq());
            insertFileDtl.setFileNm(originalFileName);
            insertFileDtl.setFilePath(filePath);
            insertFileDtl.setFileType(extension);
            insertFileDtl.setSortSeq(fileMeta.getSortSeq());

            insertFileDtlList.add(insertFileDtl);
        });

        Integer fileSeq = null;

        if(!insertFileDtlList.isEmpty()){
            fileSeq = insertFileDtlList.get(0).getFileSeq();

            for(FileDetailDto fileDto : insertFileDtlList){
                fileDto.setRgstUserSeq(loginUser.getUserSeq());
                fileDto.setUptUserSeq(loginUser.getUserSeq());

                if(fileSeq == null && !fileDao.checkExistFileSeq(fileDto.getFileSeq())){
                    fileDao.insertFile(fileDto);
                    fileSeq = fileDto.getFileSeq();
                }

                fileDto.setFileSeq(fileSeq);
                fileDao.insertFileDetail(fileDto);
            }
        }

        return fileSeq;
    }

    @Override
    public void updateFile(LoginUser loginUser, String updateFileListJson){
        if (updateFileListJson == null) return;

        List<FileDetailDto> updateFileList;
        try {
            updateFileList = objectMapper.readValue(updateFileListJson, new TypeReference<List<FileDetailDto>>() {});
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("파일 메타 JSON 파싱 실패", e);
        }

        for (FileDetailDto fileDto : updateFileList) {
            fileDto.setUptUserSeq(loginUser.getUserSeq());

            fileDao.updateFileDetail(fileDto);
        }
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(String filePath){
        // 경로 탈출 방지: 정규화 후 uploadDir 하위인지 검증
        Path uploadDirPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path normalizedPath = Paths.get(filePath).toAbsolutePath().normalize();
        if (!normalizedPath.startsWith(uploadDirPath)) {
            return ResponseEntity.badRequest().build();
        }

        File file = normalizedPath.toFile();

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        org.springframework.core.io.Resource resource;
        try {
            resource = new UrlResource(file.toURI());
        } catch (java.net.MalformedURLException e) {
            throw new RuntimeException("잘못된 파일 경로: " + filePath, e);
        }

        String encodedFileName = URLEncoder.encode(file.getName(), StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"")
                .body(resource);
    }

    @Override
    public void deleteFile(LoginUser loginUser, String deleteFileListJson){
        if (deleteFileListJson == null) return;

        List<FileDetailDto> deleteFileList;
        try {
            deleteFileList = objectMapper.readValue(deleteFileListJson, new TypeReference<List<FileDetailDto>>() {});
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("파일 메타 JSON 파싱 실패", e);
        }

        for (FileDetailDto fileDto : deleteFileList) {
            File file = new File(fileDto.getFilePath());
            if (file.exists()) {
                //파일 서버에서 삭제하지 말고 남기도록 주석처리
                file.delete();
            }

            fileDto.setUptUserSeq(loginUser.getUserSeq());

            fileDao.deleteFileDetail(fileDto);
        }
    }

    @Override
    public void deleteAllFile(LoginUser loginUser, Integer fileSeq){
        List<FileDetailDto> existFileList = fileDao.selectFile(fileSeq);

        if(existFileList.isEmpty()) return;

        for(FileDetailDto fileDto : existFileList){
            File file = new File(fileDto.getFilePath());
            if (file.exists()) {
                //파일 서버에서 삭제하지 말고 남기도록 주석처리
                file.delete();
            }

            fileDto.setUptUserSeq(loginUser.getUserSeq());

            fileDao.deleteFileDetail(fileDto);
        }

        FileDetailDto deleteFileDto = new FileDetailDto();
        deleteFileDto.setUptUserSeq(loginUser.getUserSeq());
        deleteFileDto.setFileSeq(fileSeq);

        fileDao.deleteFile(deleteFileDto);
    }
}
