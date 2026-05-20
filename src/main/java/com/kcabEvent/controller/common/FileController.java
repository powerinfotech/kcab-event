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
                                                 @RequestParam(value = "deleteFileList", required = false) String deleteFileListJson,
                                                 @RequestParam(value = "uploadContext", required = false) String uploadContext) {

        Integer resFileSeq = fileSeq;

        Integer newFileSeq = fileService.addFile(loginUser, insertFileMetaListJson, insertFiles, uploadContext);
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
     * 리치 에디터 본문에 삽입할 인라인 이미지를 업로드한다.
     * 응답의 {@code url}을 그대로 {@code <img src="...">}에 사용할 수 있다.
     */
    @PostMapping("/editor/upload-image")
    public ApiResponse<EditorImageUploadResponse> uploadEditorImage(
            @KcabEventSession LoginUser loginUser,
            @RequestPart("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "uploadContext", required = false) String uploadContext
    ) {
        com.kcabEvent.dto.common.FileDetailDto detail = fileService.uploadInlineImage(loginUser, file, uploadContext);
        EditorImageUploadResponse res = new EditorImageUploadResponse();
        res.setFileDtlSeq(detail.getFileDtlSeq());
        res.setFileNm(detail.getFileNm());
        res.setUrl(detail.getFileUrl());
        return ApiResponse.ok(res);
    }

    /** 이미지 파일 서빙 (세션 불필요 — public 경로). */
    @GetMapping({"/public/editor-image/{fileDtlSeq}", "/public/file-image/{fileDtlSeq}"})
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> serveEditorImage(
            @PathVariable Integer fileDtlSeq
    ) {
        return fileService.streamInlineFile(fileDtlSeq);
    }

    @lombok.Getter @lombok.Setter
    public static class EditorImageUploadResponse {
        private Integer fileDtlSeq;
        private String fileNm;
        private String url;
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
