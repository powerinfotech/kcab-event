package com.kcabEvent.service.noticenews.impl;

import com.kcabEvent.dao.NoticeNewsDao;
import com.kcabEvent.domain.NoticeNews;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.noticenews.NoticeNewsDetailDto;
import com.kcabEvent.dto.noticenews.NoticeNewsListDto;
import com.kcabEvent.dto.noticenews.NoticeNewsSaveDto;
import com.kcabEvent.dto.noticenews.NoticeNewsSearchDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.noticenews.NoticeNewsService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service("noticeNewsService")
public class NoticeNewsServiceImpl extends EgovAbstractServiceImpl implements NoticeNewsService {

    private static final Set<String> ALLOWED_POST_TYPES = Set.of("NEWS", "NOTICE");

    @Resource(name = "noticeNewsDao")
    private NoticeNewsDao noticeNewsDao;

    @Override
    public List<NoticeNewsListDto> selectNoticeNewsList(NoticeNewsSearchDto search) {
        NoticeNewsSearchDto normalized = search != null ? search : new NoticeNewsSearchDto();
        normalized.setPostType(normalizePostType(normalized.getPostType(), true));
        normalized.setUseYn(normalizeYn(normalized.getUseYn(), true));
        if (normalized.getKeyword() != null) {
            String trimmed = normalized.getKeyword().trim();
            normalized.setKeyword(trimmed.isEmpty() ? null : trimmed);
        }
        return noticeNewsDao.selectNoticeNewsList(normalized);
    }

    @Override
    public NoticeNewsDetailDto selectNoticeNewsDetail(Long noticeNewsSeq) {
        if (noticeNewsSeq == null) {
            throw new BusinessException("Notice/News id is required.");
        }
        NoticeNewsDetailDto detail = noticeNewsDao.selectNoticeNewsDetail(noticeNewsSeq);
        if (detail == null) {
            throw new BusinessException("Notice/News was not found.");
        }
        return detail;
    }

    @Override
    @Transactional("transactionManager")
    public NoticeNewsDetailDto selectPublicNoticeNewsDetail(Long noticeNewsSeq) {
        NoticeNewsDetailDto detail = selectNoticeNewsDetail(noticeNewsSeq);
        if (!"Y".equals(detail.getUseYn())) {
            throw new BusinessException("Notice/News was not found.");
        }
        noticeNewsDao.incrementViewCount(noticeNewsSeq);
        detail.setViewCount((detail.getViewCount() == null ? 0 : detail.getViewCount()) + 1);
        return detail;
    }

    @Override
    @Transactional("transactionManager")
    public Long saveNoticeNews(NoticeNewsSaveDto saveDto, LoginUser loginUser) {
        if (saveDto == null) {
            throw new BusinessException("Request body is required.");
        }
        Long userSeq = loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null;

        NoticeNews entity = new NoticeNews();
        entity.setNoticeNewsSeq(saveDto.getNoticeNewsSeq());
        entity.setPostType(normalizePostType(saveDto.getPostType(), false));
        entity.setTitle(requireText(saveDto.getTitle(), "Title is required."));
        entity.setContent(saveDto.getContent());
        entity.setPostDate(saveDto.getPostDate() != null ? saveDto.getPostDate() : LocalDate.now());
        entity.setTopYn(normalizeYn(saveDto.getTopYn(), false, "N"));
        if ("Y".equals(entity.getTopYn())) {
            if (saveDto.getTopStartDate() == null || saveDto.getTopEndDate() == null) {
                throw new BusinessException("Top start date and end date are required.");
            }
            if (saveDto.getTopStartDate().isAfter(saveDto.getTopEndDate())) {
                throw new BusinessException("Top end date must be on or after top start date.");
            }
            entity.setTopStartDate(saveDto.getTopStartDate());
            entity.setTopEndDate(saveDto.getTopEndDate());
        } else {
            entity.setTopStartDate(null);
            entity.setTopEndDate(null);
        }
        entity.setUseYn(normalizeYn(saveDto.getUseYn(), false, "Y"));
        entity.setFileSeq(saveDto.getFileSeq());
        entity.setUptUserSeq(userSeq);

        if (entity.getNoticeNewsSeq() == null) {
            entity.setRgstUserSeq(userSeq);
            noticeNewsDao.insertNoticeNews(entity);
        } else {
            int updated = noticeNewsDao.updateNoticeNews(entity);
            if (updated == 0) {
                throw new BusinessException("Notice/News was not found.");
            }
        }
        return entity.getNoticeNewsSeq();
    }

    @Override
    @Transactional("transactionManager")
    public void deleteNoticeNews(Long noticeNewsSeq, LoginUser loginUser) {
        if (noticeNewsSeq == null) {
            throw new BusinessException("Notice/News id is required.");
        }
        Long userSeq = loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null;
        int deleted = noticeNewsDao.softDeleteNoticeNews(noticeNewsSeq, userSeq);
        if (deleted == 0) {
            throw new BusinessException("Notice/News was not found.");
        }
    }

    private String normalizePostType(String value, boolean allowNull) {
        if (value == null || value.isBlank()) {
            if (allowNull) return null;
            throw new BusinessException("Post type is required.");
        }
        String upper = value.trim().toUpperCase();
        if (!ALLOWED_POST_TYPES.contains(upper)) {
            throw new BusinessException("Post type must be one of: NEWS, NOTICE.");
        }
        return upper;
    }

    private String normalizeYn(String value, boolean allowNull) {
        return normalizeYn(value, allowNull, null);
    }

    private String normalizeYn(String value, boolean allowNull, String defaultValue) {
        if (value == null || value.isBlank()) {
            if (allowNull) return null;
            return defaultValue;
        }
        String upper = value.trim().toUpperCase();
        if (!"Y".equals(upper) && !"N".equals(upper)) {
            throw new BusinessException("Use 'Y' or 'N'.");
        }
        return upper;
    }

    private String requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new BusinessException(message);
        }
        return value.trim();
    }
}
