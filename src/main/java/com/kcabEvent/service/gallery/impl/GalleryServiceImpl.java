package com.kcabEvent.service.gallery.impl;

import com.kcabEvent.dao.GalleryDao;
import com.kcabEvent.domain.Gallery;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.gallery.GalleryDetailDto;
import com.kcabEvent.dto.gallery.GalleryImageDto;
import com.kcabEvent.dto.gallery.GalleryListDto;
import com.kcabEvent.dto.gallery.GallerySaveDto;
import com.kcabEvent.dto.gallery.GallerySearchDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.gallery.GalleryService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service("galleryService")
public class GalleryServiceImpl extends EgovAbstractServiceImpl implements GalleryService {

    @Resource(name = "galleryDao")
    private GalleryDao galleryDao;

    @Value("${file.url.image-prefix:/api/public/file-image}")
    private String imageUrlPrefix;

    @Override
    public List<GalleryListDto> selectGalleryList(GallerySearchDto search) {
        GallerySearchDto normalized = normalizeSearch(search);
        List<GalleryListDto> galleries = galleryDao.selectGalleryList(normalized);
        galleries.forEach(this::applyCoverUrl);
        return galleries;
    }

    @Override
    public GalleryDetailDto selectGalleryDetail(Long gallerySeq) {
        if (gallerySeq == null) {
            throw new BusinessException("Gallery id is required.");
        }
        GalleryDetailDto detail = galleryDao.selectGalleryDetail(gallerySeq);
        if (detail == null) {
            throw new BusinessException("Gallery was not found.");
        }
        if (detail.getFileSeq() != null) {
            detail.setImages(applyImageUrls(galleryDao.selectGalleryImages(detail.getFileSeq())));
        }
        applyCoverUrl(detail);
        return detail;
    }

    @Override
    public List<GalleryListDto> selectPublicGalleryList(Integer galleryYear) {
        GallerySearchDto search = new GallerySearchDto();
        search.setGalleryYear(galleryYear);
        search.setUseYn("Y");
        List<GalleryListDto> galleries = galleryDao.selectGalleryList(search);
        galleries.forEach((gallery) -> {
            applyCoverUrl(gallery);
            if (gallery.getFileSeq() != null) {
                gallery.setImages(applyImageUrls(galleryDao.selectGalleryImages(gallery.getFileSeq())));
            }
        });
        return galleries;
    }

    @Override
    @Transactional("transactionManager")
    public Long saveGallery(GallerySaveDto saveDto, LoginUser loginUser) {
        if (saveDto == null) {
            throw new BusinessException("Request body is required.");
        }
        Long userSeq = loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null;

        Gallery entity = new Gallery();
        entity.setGallerySeq(saveDto.getGallerySeq());
        entity.setTitle(requireText(saveDto.getTitle(), "Title is required."));
        entity.setGalleryYear(resolveGalleryYear(saveDto.getGalleryYear(), saveDto.getGallerySeq() == null));
        entity.setDescription(saveDto.getDescription());
        entity.setFileSeq(saveDto.getFileSeq());
        entity.setSortSeq(saveDto.getSortSeq() != null ? saveDto.getSortSeq() : 0);
        entity.setUseYn(normalizeYn(saveDto.getUseYn(), "Y"));
        entity.setUptUserSeq(userSeq);

        if (entity.getGallerySeq() == null) {
            entity.setRgstUserSeq(userSeq);
            galleryDao.insertGallery(entity);
        } else {
            int updated = galleryDao.updateGallery(entity);
            if (updated == 0) {
                throw new BusinessException("Gallery was not found.");
            }
        }
        return entity.getGallerySeq();
    }

    @Override
    @Transactional("transactionManager")
    public void deleteGallery(Long gallerySeq, LoginUser loginUser) {
        if (gallerySeq == null) {
            throw new BusinessException("Gallery id is required.");
        }
        Long userSeq = loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null;
        int deleted = galleryDao.softDeleteGallery(gallerySeq, userSeq);
        if (deleted == 0) {
            throw new BusinessException("Gallery was not found.");
        }
    }

    private GallerySearchDto normalizeSearch(GallerySearchDto search) {
        GallerySearchDto normalized = search != null ? search : new GallerySearchDto();
        normalized.setUseYn(normalizeYnNullable(normalized.getUseYn()));
        if (normalized.getKeyword() != null) {
            String trimmed = normalized.getKeyword().trim();
            normalized.setKeyword(trimmed.isEmpty() ? null : trimmed);
        }
        return normalized;
    }

    private Integer resolveGalleryYear(Integer year, boolean insert) {
        if (year == null) {
            return insert ? LocalDate.now().getYear() : null;
        }
        if (year < 2000 || year > 2100) {
            throw new BusinessException("Gallery year must be between 2000 and 2100.");
        }
        return year;
    }

    private String normalizeYn(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        String upper = value.trim().toUpperCase();
        if (!"Y".equals(upper) && !"N".equals(upper)) {
            throw new BusinessException("Use 'Y' or 'N'.");
        }
        return upper;
    }

    private String normalizeYnNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return normalizeYn(value, "Y");
    }

    private String requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new BusinessException(message);
        }
        return value.trim();
    }

    private void applyCoverUrl(GalleryListDto gallery) {
        if (gallery == null || gallery.getCoverFileDtlSeq() == null) {
            return;
        }
        gallery.setCoverFileUrl(buildImageUrl(gallery.getCoverFileDtlSeq()));
    }

    private void applyCoverUrl(GalleryDetailDto gallery) {
        if (gallery == null || gallery.getCoverFileDtlSeq() == null) {
            return;
        }
        gallery.setCoverFileUrl(buildImageUrl(gallery.getCoverFileDtlSeq()));
    }

    private List<GalleryImageDto> applyImageUrls(List<GalleryImageDto> images) {
        if (images == null) {
            return List.of();
        }
        images.forEach((image) -> image.setFileUrl(buildImageUrl(image.getFileDtlSeq())));
        return images;
    }

    private String buildImageUrl(Long fileDtlSeq) {
        if (fileDtlSeq == null) return null;
        String normalizedPrefix = imageUrlPrefix == null || imageUrlPrefix.isBlank()
                ? "/api/public/file-image"
                : imageUrlPrefix.trim();
        if (normalizedPrefix.endsWith("/")) {
            normalizedPrefix = normalizedPrefix.substring(0, normalizedPrefix.length() - 1);
        }
        return normalizedPrefix + "/" + fileDtlSeq;
    }
}
