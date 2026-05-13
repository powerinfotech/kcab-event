package com.kcabEvent.service.common;

import com.kcabEvent.dto.common.FileDetailDto;
import com.kcabEvent.dto.common.LoginUser;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * FileService - 파일 관리 서비스 인터페이스
 *
 * <p>파일 업로드, 다운로드, 수정, 삭제 기능을 제공한다.
 * 파일은 {@code ${file.path.dir}} 경로에 UUID 파일명으로 저장되고, DB에 경로 정보가 기록된다.</p>
 *
 * @see com.kcabEvent.service.common.impl.FileServiceImpl
 * @see com.kcabEvent.controller.FileController
 */
public interface FileService {
    /**
     * 파일 그룹에 속한 파일 목록을 조회한다.
     *
     * @param fileSeq 파일 그룹 순번
     */
    List<FileDetailDto> getFileList(Integer fileSeq);
    /**
     * 파일을 서버에 저장하고 DB에 등록한다.
     *
     * @param loginUser              현재 로그인 사용자
     * @param insertFileMetaListJson 파일 메타 정보 JSON 문자열 (파일명·정렬 순서 등)
     * @param insertFiles            업로드된 멀티파트 파일 목록
     * @return 생성된 파일 그룹 순번 ({@code fileSeq})
     */
    Integer addFile(LoginUser loginUser, String insertFileMetaListJson, List<MultipartFile> insertFiles);
    /**
     * 파일 상세 정보를 수정한다 (삭제 여부, 정렬 순서 등).
     *
     * @param loginUser          현재 로그인 사용자
     * @param updateFileListJson 수정할 파일 목록 JSON 문자열
     */
    void updateFile(LoginUser loginUser, String updateFileListJson);
    /**
     * 파일을 다운로드한다.
     * 경로 탈출({@code ..}) 시도는 400 Bad Request로 거부한다.
     *
     * @param filePath 서버 저장 경로 (DB의 {@code file_path} 값)
     * @return 파일 다운로드 ResponseEntity
     */
    ResponseEntity<Resource> downloadFile(String filePath);
    /**
     * 지정한 파일 목록을 논리 삭제한다 (파일 서버에서 실제 삭제하지 않음).
     *
     * @param loginUser          현재 로그인 사용자
     * @param deleteFileListJson 삭제할 파일 목록 JSON 문자열
     */
    void deleteFile(LoginUser loginUser, String deleteFileListJson);
    /**
     * 파일 그룹 전체를 논리 삭제한다.
     *
     * @param loginUser 현재 로그인 사용자
     * @param fileSeq   파일 그룹 순번
     */
    void deleteAllFile(LoginUser loginUser, Integer fileSeq);

    /**
     * 리치 에디터 본문에 삽입할 인라인 이미지를 업로드한다.
     *
     * @param loginUser 현재 로그인 사용자
     * @param file      업로드된 이미지 파일
     * @return 저장된 파일 상세
     */
    FileDetailDto uploadInlineImage(LoginUser loginUser, MultipartFile file);

    /**
     * 파일 상세 단건을 조회한다.
     */
    FileDetailDto getFileDetailBySeq(Integer fileDtlSeq);

    /**
     * 인라인 이미지 등 파일을 브라우저에 인라인으로 서빙한다 (Content-Disposition: inline).
     */
    ResponseEntity<Resource> streamInlineFile(Integer fileDtlSeq);
}
