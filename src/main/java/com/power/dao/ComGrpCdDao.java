package com.power.dao;

import com.power.domain.ComGrpCd;
import com.power.dto.code.ComGrpCdListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

/**
 * ComGrpCdDao - 공통 코드 그룹 MyBatis 매퍼 인터페이스
 *
 * <p>공통 코드 그룹(tb_com_grp_cd) 테이블의 조회 및 저장을 담당한다.
 * 코드 그룹은 삭제를 지원하지 않으므로 DELETE 메서드가 없다.</p>
 *
 * @see com.power.service.code.ComGrpCdService
 */
@EgovMapper("comGrpCdDao")
public interface ComGrpCdDao {
    /**
     * 공통 코드 그룹 목록을 조회한다.
     *
     * @param searchText 그룹명 검색어 ({@code null}이면 전체)
     */
    List<ComGrpCdListDto> selectComGrpCdList(@Param("searchText") String searchText, @Param("useYn") String useYn);
    /** 공통 코드 그룹을 등록한다. */
    void insertComGrpCd(ComGrpCd comGrpCd);
    /** 공통 코드 그룹을 수정한다. */
    void updateComGrpCd(ComGrpCd comGrpCd);
}
