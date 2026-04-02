package com.miso.lxnn.dao;

import com.miso.lxnn.domain.ComCd;
import com.miso.lxnn.dto.code.ComCdListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

/**
 * ComCdDao - 공통 코드 MyBatis 매퍼 인터페이스
 *
 * <p>공통 코드(tb_com_cd) 테이블의 CRUD를 담당한다.</p>
 *
 * @see com.miso.lxnn.service.code.ComCdService
 */
@EgovMapper("comCdDao")
public interface ComCdDao {
    /**
     * 코드 그룹에 속한 공통 코드 목록을 조회한다.
     *
     * @param comGrpCdSeq 코드 그룹 고유 순번
     */
    List<ComCdListDto> selectComCdList(@Param("comGrpCdSeq") Long comGrpCdSeq) throws Exception;
    /** 공통 코드를 등록한다. */
    void insertComCd(ComCd comCd) throws Exception;
    /** 공통 코드를 수정한다. */
    void updateComCd(ComCd comCd) throws Exception;
    /** 공통 코드를 삭제한다. */
    void deleteComCd(@Param("comCdSeq") Long comCdSeq) throws Exception;
}
