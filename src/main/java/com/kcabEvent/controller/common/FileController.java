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

/**
 * 공통 파일 메타데이터 조회, 업로드, 다운로드, 삭제 API를 제공한다.
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class FileController {
    private final FileService fileService;

    /**
     * 파일 순번에 해당하는 파일 상세 목록을 조회한다.
     */
    @GetMapping("/file-list")
    public ApiResponse<List<FileDetailDto>> selectFileList(@RequestParam(value = "fileSeq", required = false) Integer fileSeq) {
        List<FileDetailDto> fileList = fileService.getFileList(fileSeq);
        return ApiResponse.ok(fileList);
    }

    /**
     * 파일 추가, 메타데이터 수정, 삭제를 한 요청에서 처리한다.
     */
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

    /**
     * 저장된 파일을 경로 기준으로 다운로드한다.
     */
    @GetMapping("/download-file")
    public ResponseEntity<Resource> downloadFile(@RequestParam String filePath) {
        return fileService.downloadFile(filePath);
    }

    /**
     * 요청 데이터에 포함된 선택 파일을 삭제한다.
     */
    @DeleteMapping("/delete-file")
    public ApiResponse<Void> deleteFile(@KcabEventSession LoginUser loginUser,
                                        @RequestParam(value = "deleteFileList") String deleteFileListJson) {
        fileService.deleteFile(loginUser, deleteFileListJson);
        return ApiResponse.ok(null);
    }

    /**
     * 파일 순번에 속한 모든 파일을 삭제한다.
     */
    @DeleteMapping("/delete-all-file")
    public ApiResponse<Void> deleteAllFile(@KcabEventSession LoginUser loginUser,
                                           @RequestParam(value = "fileSeq") Integer fileSeq) {
        fileService.deleteAllFile(loginUser, fileSeq);
        return ApiResponse.ok(null);
    }
}
