package com.miso.lxnn.service.code.impl;

import com.miso.lxnn.dao.ComCdDao;
import com.miso.lxnn.dto.code.ComCdListDto;
import com.miso.lxnn.dto.code.ComCdSaveDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.code.ComCdService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

/**
 * ComCdServiceImpl - {@link ComCdService} 구현체
 *
 * <p>공통 코드를 IudType에 따라 INSERT / UPDATE / DELETE 처리한다.
 * 신규 코드 등록 시 {@code comStdCd}를 {@code comGrpCd + comCd}로 자동 조합한다.</p>
 */
@Slf4j
@Service("comCdService")
public class ComCdServiceImpl extends EgovAbstractServiceImpl implements ComCdService {

    @Resource(name = "comCdDao")
    private ComCdDao comCdDao;

    @Override
    public List<ComCdListDto> selectComCdList(Long comGrpCdSeq) throws Exception {
        return comCdDao.selectComCdList(comGrpCdSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void saveComCd(@Valid ComCdSaveDto saveDto, LoginUser loginUser) throws Exception {
        if (saveDto.getComCdList() == null) return;

        String comGrpCd = saveDto.getComGrpCd();

        for (ComCdListDto item : saveDto.getComCdList()) {
            if (item.getIudType() == null) continue;

            switch (item.getIudType()) {
                case I:
                    item.setComGrpCdSeq(saveDto.getComGrpCdSeq());
                    item.setComStdCd(comGrpCd + item.getComCd());
                    item.setRgstUserSeq(Long.valueOf(loginUser.getUserSeq()));
                    item.setUptUserSeq(Long.valueOf(loginUser.getUserSeq()));
                    comCdDao.insertComCd(item);
                    break;
                case U:
                    item.setUptUserSeq(Long.valueOf(loginUser.getUserSeq()));
                    comCdDao.updateComCd(item);
                    break;
                case D:
                    comCdDao.deleteComCd(item.getComCdSeq());
                    break;
                default:
                    break;
            }
        }
    }
}
