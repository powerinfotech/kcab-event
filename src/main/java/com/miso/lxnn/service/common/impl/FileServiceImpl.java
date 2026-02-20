package com.miso.lxnn.service.common.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miso.lxnn.dao.FileDao;
import com.miso.lxnn.dto.common.FileDetailDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.common.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service("fileService")
public class FileServiceImpl implements FileService {

    @Resource(name="fileDao")
    private FileDao fileDao;

    @Value("${file.path.dir}")
    private String uploadDir;

    @Override
    public List<FileDetailDto> getFileList(Integer fileSeq) throws Exception{
        return fileDao.selectFile(fileSeq);
    }

    @Override
    public Integer addFile(LoginUser loginUser, String insertFileMetaListJson, List<MultipartFile> insertFiles) throws Exception {
        if(insertFiles == null) return null;

        ObjectMapper objectMapper = new ObjectMapper();
        List<FileDetailDto> insertFileMetaList = objectMapper.readValue(
                insertFileMetaListJson,
                new TypeReference<List<FileDetailDto>>() {}
        );

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

            insertFileDtl.setFileSeq(Objects.requireNonNull(fileMeta).getFileSeq());
            insertFileDtl.setMenuSeq(fileMeta.getMenuSeq());
            insertFileDtl.setFileNm(originalFileName);
            insertFileDtl.setFilePath(filePath);
            insertFileDtl.setFileType(extension);
            insertFileDtl.setSrtSq(fileMeta.getSrtSq());

            insertFileDtlList.add(insertFileDtl);
        });

        Integer fileSeq = null;

        if(!insertFileDtlList.isEmpty()){
            fileSeq = insertFileDtlList.get(0).getFileSeq();

            for(FileDetailDto fileDto : insertFileDtlList){
                fileDto.setRgstUserId(loginUser.getUserId());
                fileDto.setUptUserId(loginUser.getUserId());

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
    public void updateFile(LoginUser loginUser, String updateFileListJson) throws Exception{
        if (updateFileListJson == null) return;

        ObjectMapper objectMapper = new ObjectMapper();
        List<FileDetailDto> updateFileList = objectMapper.readValue(updateFileListJson, new TypeReference<List<FileDetailDto>>() {});

        for (FileDetailDto fileDto : updateFileList) {
            fileDto.setUptUserId(loginUser.getUserId());

            fileDao.updateFileDetail(fileDto);
        }
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(String filePath) throws Exception{
        // 경로 탈출 방지
        if (filePath.contains("..")) {
            return ResponseEntity.badRequest().build();
        }

        Path fileDirPath = Paths.get(filePath).normalize();
        File file = fileDirPath.toFile();

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        org.springframework.core.io.Resource resource = new UrlResource(file.toURI());

        String encodedFileName = URLEncoder.encode(file.getName(), StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"")
                .body(resource);
    }

    @Override
    public void deleteFile(LoginUser loginUser, String deleteFileListJson) throws Exception{
        if (deleteFileListJson == null) return;

        ObjectMapper objectMapper = new ObjectMapper();
        List<FileDetailDto> deleteFileList = objectMapper.readValue(deleteFileListJson, new TypeReference<List<FileDetailDto>>() {});

        for (FileDetailDto fileDto : deleteFileList) {
            File file = new File(uploadDir, fileDto.getFilePath());
            if (file.exists()) {
                //파일 서버에서 삭제하지 말고 남기도록 주석처리
                //file.delete();
            }

            fileDto.setUptUserId(loginUser.getUserId());

            fileDao.deleteFileDetail(fileDto);
        }
    }

    @Override
    public void deleteAllFile(LoginUser loginUser, Integer fileSeq) throws Exception{
        List<FileDetailDto> existFileList = fileDao.selectFile(fileSeq);

        if(existFileList.isEmpty()) return;

        for(FileDetailDto fileDto : existFileList){
            File file = new File(uploadDir, fileDto.getFilePath());
            if (file.exists()) {
                //파일 서버에서 삭제하지 말고 남기도록 주석처리
                //file.delete();
            }

            fileDto.setUptUserId(loginUser.getUserId());

            fileDao.deleteFileDetail(fileDto);
        }

        FileDetailDto deleteFileDto = new FileDetailDto();
        deleteFileDto.setUptUserId(loginUser.getUserId());
        deleteFileDto.setFileSeq(fileSeq);

        fileDao.deleteFile(deleteFileDto);
    }
}
