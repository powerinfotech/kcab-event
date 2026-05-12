package com.kcabEvent.service.gallery;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.gallery.GalleryDetailDto;
import com.kcabEvent.dto.gallery.GalleryListDto;
import com.kcabEvent.dto.gallery.GallerySaveDto;
import com.kcabEvent.dto.gallery.GallerySearchDto;

import java.util.List;

public interface GalleryService {
    List<GalleryListDto> selectGalleryList(GallerySearchDto search);

    GalleryDetailDto selectGalleryDetail(Long gallerySeq);

    List<GalleryListDto> selectPublicGalleryList(Integer galleryYear);

    Long saveGallery(GallerySaveDto saveDto, LoginUser loginUser);

    void deleteGallery(Long gallerySeq, LoginUser loginUser);
}
