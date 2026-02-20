package com.miso.lxnn.service.master.impl;

import com.miso.lxnn.dao.ComCodeDao;
import com.miso.lxnn.dao.SetupDao;
import com.miso.lxnn.dto.code.SensorStateNationAddrSearchDto;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.AreaListDto;
import com.miso.lxnn.dto.master.AreaListSearchDto;
import com.miso.lxnn.dto.master.SectorListDto;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.service.master.SetupManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("setupManagementService")
public class SetupManagementServiceImpl extends EgovAbstractServiceImpl implements SetupManagementService {
    @Resource(name="setupDao")
    private SetupDao setupDao;

    @Resource(name="comCodeDao")
    private ComCodeDao comCodeDao;

    @Override
    public List<AreaListDto> selectAreaList(AreaListSearchDto searchParam) throws Exception {
        return setupDao.selectAreaList(searchParam);
    }

    @Override
    public List<SectorListDto> selectSectorList(Integer areaSeq) throws Exception {
        return setupDao.selectSectorList(areaSeq);
    }

    @Override
    public void saveArea(LoginUser loginUser, AreaListDto saveParam) throws Exception {
        IudType dataIudType = saveParam.getIudType();

        if(dataIudType == IudType.I){
            saveParam.setRgstUserId(loginUser.getUserId());
            saveParam.setUptUserId(loginUser.getUserId());
            setupDao.insertArea(saveParam);
        } else if(dataIudType == IudType.U){
            saveParam.setUptUserId(loginUser.getUserId());
            setupDao.updateArea(saveParam);
        }
    }

    @Override
    public void deleteArea(AreaListDto saveParam) throws Exception {
        setupDao.deleteArea(saveParam.getAreaSeq());
    }

    @Override
    public List<CodeResponseDto> selectAreaCmCodeList() throws Exception {
        return comCodeDao.getCommonCodeList("A09").stream()
                                                            .map(x -> new CodeResponseDto(x.getCmNm(),x.getCmStdCd()))
                                                            .toList();
    }
}
