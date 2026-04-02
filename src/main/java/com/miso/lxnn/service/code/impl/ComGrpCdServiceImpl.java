package com.miso.lxnn.service.code.impl;

import com.miso.lxnn.dao.ComGrpCdDao;
import com.miso.lxnn.dto.code.ComGrpCdListDto;
import com.miso.lxnn.dto.code.ComGrpCdSaveDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.code.ComGrpCdService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * ComGrpCdServiceImpl - {@link ComGrpCdService} 구현체
 *
 * <p>공통 코드 그룹을 IudType에 따라 INSERT / UPDATE 처리한다.
 * 코드 그룹은 DELETE를 지원하지 않으므로 {@code D}는 무시된다.</p>
 */
@Slf4j
@Service("comGrpCdService")
public class ComGrpCdServiceImpl extends EgovAbstractServiceImpl implements ComGrpCdService {

    @Resource(name = "comGrpCdDao")
    private ComGrpCdDao comGrpCdDao;

    @Override
    public List<ComGrpCdListDto> selectComGrpCdList(String searchText, String useYn) throws Exception {
        return comGrpCdDao.selectComGrpCdList(searchText, useYn);
    }

    @Override
    @Transactional("transactionManager")
    public void saveComGrpCd(@Valid ComGrpCdSaveDto saveDto, LoginUser loginUser) throws Exception {
        if (saveDto.getComGrpCdList() == null) return;

        for (ComGrpCdListDto item : saveDto.getComGrpCdList()) {
            if (item.getIudType() == null) continue;
            switch (item.getIudType()) {
                case I:
                    item.setRgstUserSeq(Long.valueOf(loginUser.getUserSeq()));
                    item.setUptUserSeq(Long.valueOf(loginUser.getUserSeq()));
                    comGrpCdDao.insertComGrpCd(item);
                    break;
                case U:
                    item.setUptUserSeq(Long.valueOf(loginUser.getUserSeq()));
                    comGrpCdDao.updateComGrpCd(item);
                    break;
                default:
                    break;
            }
        }
    }
}
