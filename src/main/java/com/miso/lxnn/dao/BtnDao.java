package com.miso.lxnn.dao;

import com.miso.lxnn.domain.Btn;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

/**
 * BtnDao - 버튼 MyBatis 매퍼 인터페이스
 *
 * <p>시스템에서 사용 가능한 전체 버튼(tb_btn)을 조회한다.
 * 메뉴 관리 화면에서 메뉴에 연결할 버튼 선택 목록에 사용된다.</p>
 */
@EgovMapper("btnDao")
public interface BtnDao {
    /** 전체 버튼 목록을 조회한다. */
    List<Btn> selectBtnList();
}
