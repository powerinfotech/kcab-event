package com.miso.lxnn.service.master.impl;

import com.miso.lxnn.dao.ComCodeDao;
import com.miso.lxnn.dao.NoticeDao;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.NoticeListDto;
import com.miso.lxnn.dto.master.NoticeListSearchDto;
import com.miso.lxnn.dto.master.NoticeSaveDto;
import com.miso.lxnn.service.master.NoticeUserManagementService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.apache.bcel.classfile.Code;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("NoticeUserManagementService")
@Slf4j
public class NoticeUserManagementServiceImpl implements NoticeUserManagementService {

    @Resource(name="noticeDao")
    private NoticeDao noticeDao;

    @Resource(name="comCodeDao")
    private ComCodeDao comCodeDao;

    public List<CodeResponseDto> searchConditions(){
        return comCodeDao.getCommonCodeList("A12").stream().map(x->new CodeResponseDto(x.getCmNm(),x.getCmStdCd())).toList();
    }

    public List<NoticeListDto> selectNoticeList(NoticeListSearchDto dto){
        return noticeDao.selectNoticeList(dto);
    }

    public Integer saveNotice(NoticeSaveDto dto, LoginUser loginUser){
        if(dto.getIudType().equalsIgnoreCase("I")){
            dto.setRgstUserId(loginUser.getUserId());
            dto.setUptUserId(loginUser.getUserId());
            noticeDao.insertNotice(dto);
        }else if(dto.getIudType().equalsIgnoreCase("U")){
            dto.setUptUserId(loginUser.getUserId());
            noticeDao.updateNotice(dto);
        }
        return dto.getNoticeSeq();
    }

    @Override
    public void deleteNotice(NoticeSaveDto dto) {
        noticeDao.deleteNotice(dto);
    }
}
