package com.miso.lxnn.service.code.impl;

import com.miso.lxnn.dao.ComCodeDao;
import com.miso.lxnn.dao.NationAddrNoDao;
import com.miso.lxnn.dto.code.NationAddrNoListDto;
import com.miso.lxnn.dto.code.NationAddrNoParamDto;
import com.miso.lxnn.dto.code.NationAddrNoSaveDto;
import com.miso.lxnn.dto.code.NationAddrNoSearchDto;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.service.code.NationAddrNoService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("nationAddrNoService")
public class NationAddrNoServiceImpl extends EgovAbstractServiceImpl implements NationAddrNoService {

    @Resource(name="nationAddrNoDao")
    private NationAddrNoDao nationAddrNoDao;

    @Resource(name="comCodeDao")
    private ComCodeDao comCodeDao;

    //검색조건
    @Override
    public NationAddrNoSearchDto searchConditions() throws Exception {
        NationAddrNoSearchDto searchDto = new NationAddrNoSearchDto();
        searchDto.setSggList(comCodeDao.getCommonCodeList("A02").stream().map(x -> new CodeResponseDto(x.getCmNm(),x.getCmStdCd(),x.getRefval02())).toList());
        searchDto.setInstlList(comCodeDao.getCommonCodeList("A03").stream().map(x -> new CodeResponseDto(x.getCmNm(),x.getCmStdCd())).toList());
        searchDto.setInstlInstList(comCodeDao.getCommonCodeList("A01").stream().map(x -> new CodeResponseDto(x.getCmNm(),x.getCmStdCd())).toList());
        return searchDto;
    }

    @Override
    public List<NationAddrNoListDto> selectNationAddrNoList(NationAddrNoParamDto param) throws Exception {
        return nationAddrNoDao.selectNationAddrNoList(param);
    }

    @Override
    public void saveNationAddrNo(List<NationAddrNoSaveDto> paramList, LoginUser user) throws Exception {
        for (NationAddrNoSaveDto param:paramList) {
            if(param.getIudType() == IudType.U) {
                param.setUptUserId(user.getUserId());
                nationAddrNoDao.updateNationAddrNo(param);
            }

        }
    }
}