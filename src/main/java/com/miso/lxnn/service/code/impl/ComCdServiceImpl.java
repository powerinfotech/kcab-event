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

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

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
