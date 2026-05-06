package com.kcabEvent.controller.common;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.*;
import com.kcabEvent.service.common.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class FileController {
    private final FileService fileService;

    @GetMapping("/file-list")
    public ApiResponse<List<FileDetailDto>> selectFileList(@RequestParam(value = "fileSeq", required = false) Integer fileSeq) {
        List<FileDetailDto> fileList = fileService.getFileList(fileSeq);
        return ApiResponse.ok(fileList);
    }

    @PostMapping("/save-file")
    public ApiResponse<FileResponseDto> saveFile(@KcabEventSession LoginUser loginUser,
                                                 @RequestPart(value = "insertFiles", required = false) List<MultipartFile> insertFiles,
                                                 @RequestParam(value = "fileSeq", required = false) Integer fileSeq,
                                                 @RequestParam(value = "insertFileMetaList", required = false) String insertFileMetaListJson,
                                                 @RequestParam(value = "updateFileList", required = false)  String updateFileListJson,
                                                 @RequestParam(value = "deleteFileList", required = false) String deleteFileListJson) {

        Integer resFileSeq = fileSeq;

        Integer newFileSeq = fileService.addFile(loginUser, insertFileMetaListJson, insertFiles);
        fileService.updateFile(loginUser, updateFileListJson);
        fileService.deleteFile(loginUser, deleteFileListJson);

        if(resFileSeq == null){
            resFileSeq = newFileSeq;
        }

        FileResponseDto fileResponse = new FileResponseDto();
        fileResponse.setFileSeq(resFileSeq);
        fileResponse.setFileList(fileService.getFileList(resFileSeq));
        
        return ApiResponse.ok(fileResponse);
    }

    @GetMapping("/download-file")
    public ResponseEntity<Resource> downloadFile(@RequestParam String filePath) {
        return fileService.downloadFile(filePath);
    }

    @DeleteMapping("/delete-file")
    public ApiResponse<Void> deleteFile(@KcabEventSession LoginUser loginUser,
                                        @RequestParam(value = "deleteFileList") String deleteFileListJson) {
        fileService.deleteFile(loginUser, deleteFileListJson);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/delete-all-file")
    public ApiResponse<Void> deleteAllFile(@KcabEventSession LoginUser loginUser,
                                           @RequestParam(value = "fileSeq") Integer fileSeq) {
        fileService.deleteAllFile(loginUser, fileSeq);
        return ApiResponse.ok(null);
    }
}
