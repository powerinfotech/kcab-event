package com.kcabEvent.dao;

import com.kcabEvent.domain.Gallery;
import com.kcabEvent.dto.gallery.GalleryDetailDto;
import com.kcabEvent.dto.gallery.GalleryImageDto;
import com.kcabEvent.dto.gallery.GalleryListDto;
import com.kcabEvent.dto.gallery.GallerySearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("galleryDao")
public interface GalleryDao {
    List<GalleryListDto> selectGalleryList(GallerySearchDto search);

    GalleryDetailDto selectGalleryDetail(@Param("gallerySeq") Long gallerySeq);

    List<GalleryImageDto> selectGalleryImages(@Param("fileSeq") Long fileSeq);

    long insertGallery(Gallery gallery);

    int updateGallery(Gallery gallery);

    int softDeleteGallery(@Param("gallerySeq") Long gallerySeq,
                          @Param("uptUserSeq") Long uptUserSeq);
}
