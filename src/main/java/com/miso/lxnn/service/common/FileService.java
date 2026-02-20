package com.miso.lxnn.service.common;

import com.miso.lxnn.dto.common.FileDetailDto;
import com.miso.lxnn.dto.common.LoginUser;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileService {
    List<FileDetailDto> getFileList(Integer fileSeq) throws Exception;
    Integer addFile(LoginUser loginUser, String insertFileMetaListJson, List<MultipartFile> insertFiles) throws Exception;
    void updateFile(LoginUser loginUser, String updateFileListJson) throws Exception;
    ResponseEntity<Resource> downloadFile(String filePath) throws Exception;
    void deleteFile(LoginUser loginUser, String deleteFileListJson) throws Exception;
    void deleteAllFile(LoginUser loginUser, Integer fileSeq) throws Exception;
}
