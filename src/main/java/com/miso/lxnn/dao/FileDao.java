package com.miso.lxnn.dao;

import com.miso.lxnn.dto.common.FileDetailDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;
/**
 * FileDao - 파일 MyBatis 매퍼 인터페이스
 *
 * <p>파일 그룹(tb_file)과 파일 상세(tb_file_dtl) 테이블의 CRUD를 담당한다.</p>
 *
 * @see com.miso.lxnn.service.common.FileService
 */
@EgovMapper("fileDao")
public interface FileDao {
    /**
     * 파일 그룹에 속한 파일 상세 목록을 조회한다.
     *
     * @param fileSeq 파일 그룹 순번
     */
    List<FileDetailDto> selectFile(@Param("fileSeq") Integer fileSeq) throws Exception;
    /**
     * 파일 그룹 순번의 존재 여부를 확인한다.
     *
     * @param fileSeq 파일 그룹 순번
     * @return 존재하면 {@code true}
     */
    Boolean checkExistFileSeq(@Param("fileSeq") Integer fileSeq) throws Exception;
    /** 파일 그룹(tb_file)을 등록한다. */
    void insertFile(FileDetailDto fileDetailDto) throws Exception;
    /** 파일 상세(tb_file_dtl)를 등록한다. */
    void insertFileDetail(FileDetailDto fileDetailDto) throws Exception;
    /** 파일 상세를 수정한다 (삭제 여부 등). */
    void updateFileDetail(FileDetailDto fileDetailDto) throws Exception;
    /** 파일 그룹을 삭제한다. */
    void deleteFile(FileDetailDto fileDetailDto) throws Exception;
    /** 파일 상세를 삭제한다. */
    void deleteFileDetail(FileDetailDto fileDetailDto) throws Exception;
}