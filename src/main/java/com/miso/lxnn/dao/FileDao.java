package com.miso.lxnn.dao;

import com.miso.lxnn.dto.common.FileDetailDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;
@Mapper("fileDao")
public interface FileDao {
    List<FileDetailDto> selectFile(@Param("fileSeq") Integer fileSeq) throws Exception;
    Boolean checkExistFileSeq(@Param("fileSeq") Integer fileSeq) throws Exception;
    void insertFile(FileDetailDto fileDetailDto) throws Exception;
    void insertFileDetail(FileDetailDto fileDetailDto) throws Exception;
    void updateFileDetail(FileDetailDto fileDetailDto) throws Exception;
    void deleteFile(FileDetailDto fileDetailDto) throws Exception;
    void deleteFileDetail(FileDetailDto fileDetailDto) throws Exception;
}