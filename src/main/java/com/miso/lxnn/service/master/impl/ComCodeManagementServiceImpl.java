package com.miso.lxnn.service.master.impl;


import com.miso.lxnn.dao.ComCodeDao;
import com.miso.lxnn.dto.common.CommonCodeSaveDto;
import com.miso.lxnn.dto.master.CommonCodeListDto;
import com.miso.lxnn.dto.master.CommonCodeListParamDto;
import com.miso.lxnn.domain.CommonGrpCode;
import com.miso.lxnn.dto.master.CommonGrpCodeListDto;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.exception.custom.BusinessException;
import com.miso.lxnn.service.master.ComCodeManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("comCodeService")
public class ComCodeManagementServiceImpl extends EgovAbstractServiceImpl implements ComCodeManagementService {

    @Resource(name="comCodeDao")
    private ComCodeDao comCodeDao;

    @Override
    public List<CommonGrpCodeListDto> selectCommonGrpCodeList(String searchText) throws Exception {
        return comCodeDao.selectCommonGrpCodeList(searchText);
    }

    @Override
    public List<CodeResponseDto> selectCommonGrpCodeSelectList() throws Exception {
        return comCodeDao.searchCommonGrpCodeList();
    }

    @Override
    public void setCommonGrpCodeSave(LoginUser LoginUser, List<CommonGrpCode> commonCodeGrpList) throws Exception {

        for (CommonGrpCode commonGrpCode :commonCodeGrpList) {
            commonGrpCode.setRgstUserId(LoginUser.getUserId());
            commonGrpCode.setUptUserId(LoginUser.getUserId());
            if (commonGrpCode.getIudType() == IudType.I) {
                if(comCodeDao.selectCommonGrpCodeCheck(commonGrpCode) > 0) {
                    throw new BusinessException("동일한 분류코드가 존재합니다.");
                }
                comCodeDao.insertCommonGrpCode(commonGrpCode);
            } else if (commonGrpCode.getIudType() == IudType.U) {
                comCodeDao.updateCommonGrpCode(commonGrpCode);
            } else if (commonGrpCode.getIudType() == IudType.D) {
                comCodeDao.deleteCommonGrpCode(commonGrpCode.getComGrpCdSeq());
                comCodeDao.deleteCommonCodeGroup(commonGrpCode.getComGrpCdSeq());
            }
        }
    }

    @Override
    public List<CommonCodeListDto> selectCommonCodeList(CommonCodeListParamDto param) throws Exception {
        return comCodeDao.selectCommonCodeList(param);
    }

    public void setCommonCodeSave(LoginUser LoginUser, List<CommonCodeSaveDto> commonCodeGrpList) throws Exception {

        for (CommonCodeSaveDto commonCode :commonCodeGrpList) {
            commonCode.setRgstUserId(LoginUser.getUserId());
            commonCode.setUptUserId(LoginUser.getUserId());
            commonCode.setCmStdCd(commonCode.getCmGrpCd().concat(commonCode.getCmCd()));
            if (commonCode.getIudType() == IudType.I) {
                if(comCodeDao.selectCommonCodeCheck(commonCode) > 0) {
                    throw new BusinessException("동일한 공통코드가 존재합니다.");
                }
                comCodeDao.insertCommonCode(commonCode);
            } else if (commonCode.getIudType() == IudType.U) {
                comCodeDao.updateCommonCode(commonCode);
            } else if (commonCode.getIudType() == IudType.D) {
                comCodeDao.deleteCommonCode(commonCode.getComCdSeq());
            }
        }
    }
}
