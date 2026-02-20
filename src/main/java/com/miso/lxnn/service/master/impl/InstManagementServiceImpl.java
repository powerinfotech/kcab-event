package com.miso.lxnn.service.master.impl;

import com.miso.lxnn.dao.ComCodeDao;
import com.miso.lxnn.dao.InstDao;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.InstListDto;
import com.miso.lxnn.dto.master.InstListSearchDto;
import com.miso.lxnn.dto.master.InstSaveDto;
import com.miso.lxnn.service.master.InstManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("InstManagementService")
public class InstManagementServiceImpl  extends EgovAbstractServiceImpl implements InstManagementService {

    @Resource(name="instDao")
    private InstDao instDao;

    @Resource(name="comCodeDao")
    private ComCodeDao comCodeDao;

    @Override
    public List<InstListDto> selectInst(InstListSearchDto instListSearchDto) throws Exception{
      return  instDao.selectInst(instListSearchDto);
    }

    @Override
    public Integer saveInst(InstSaveDto instSaveDto, LoginUser loginUser) throws Exception{
        instSaveDto.setUserId(loginUser.getUserId());

        if(instSaveDto.getIudType().equalsIgnoreCase("I")){
            instDao.insertInst(instSaveDto);
        }else if(instSaveDto.getIudType().equalsIgnoreCase("U")){
            instDao.updateInst(instSaveDto);

        }
        return instSaveDto.getInstSeq();
    }
    @Override
    public void deleteInst(InstSaveDto instSaveDto, LoginUser loginUser) throws Exception{
        instDao.deleteInst(instSaveDto);
    }
    @Override
    public List<CodeResponseDto> searchConditions(){
        return comCodeDao.getCommonCodeList("A11").stream().map(x->new CodeResponseDto(x.getCmNm(),x.getCmStdCd())).toList();
    }
}
