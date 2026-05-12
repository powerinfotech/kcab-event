package com.kcabEvent.controller.gallery;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.gallery.GalleryDetailDto;
import com.kcabEvent.dto.gallery.GalleryListDto;
import com.kcabEvent.dto.gallery.GallerySaveDto;
import com.kcabEvent.dto.gallery.GallerySearchDto;
import com.kcabEvent.service.gallery.GalleryService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/gallery")
public class GalleryController {

    @Resource(name = "galleryService")
    private GalleryService galleryService;

    @GetMapping
    public ApiResponse<List<GalleryListDto>> selectGalleryList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) Integer galleryYear,
            @RequestParam(required = false) String useYn,
            @RequestParam(required = false) String keyword
    ) {
        GallerySearchDto search = new GallerySearchDto();
        search.setGalleryYear(galleryYear);
        search.setUseYn(useYn);
        search.setKeyword(keyword);
        return ApiResponse.ok(galleryService.selectGalleryList(search));
    }

    @GetMapping("/{gallerySeq}")
    public ApiResponse<GalleryDetailDto> selectGalleryDetail(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long gallerySeq
    ) {
        return ApiResponse.ok(galleryService.selectGalleryDetail(gallerySeq));
    }

    @PostMapping
    public ApiResponse<Long> createGallery(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid GallerySaveDto saveDto
    ) {
        saveDto.setGallerySeq(null);
        return ApiResponse.ok(galleryService.saveGallery(saveDto, loginUser));
    }

    @PutMapping("/{gallerySeq}")
    public ApiResponse<Long> updateGallery(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long gallerySeq,
            @RequestBody @Valid GallerySaveDto saveDto
    ) {
        saveDto.setGallerySeq(gallerySeq);
        return ApiResponse.ok(galleryService.saveGallery(saveDto, loginUser));
    }

    @DeleteMapping("/{gallerySeq}")
    public ApiResponse<Void> deleteGallery(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long gallerySeq
    ) {
        galleryService.deleteGallery(gallerySeq, loginUser);
        return ApiResponse.ok();
    }
}
