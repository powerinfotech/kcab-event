package com.kcabEvent.controller.gallery;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.gallery.GalleryListDto;
import com.kcabEvent.service.gallery.GalleryService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/public/gallery")
public class PublicGalleryController {

    @Resource(name = "galleryService")
    private GalleryService galleryService;

    @Value("${file.path.dir}")
    private String uploadDir;

    @GetMapping("/list")
    public ApiResponse<List<GalleryListDto>> selectGalleryList(
            @RequestParam(required = false) Integer galleryYear
    ) {
        return ApiResponse.ok(galleryService.selectPublicGalleryList(galleryYear));
    }

    @GetMapping("/image")
    public ResponseEntity<org.springframework.core.io.Resource> viewImage(@RequestParam String filePath) {
        Path uploadDirPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path normalizedPath = Paths.get(filePath).toAbsolutePath().normalize();
        if (!normalizedPath.startsWith(uploadDirPath)) {
            return ResponseEntity.badRequest().build();
        }

        File file = normalizedPath.toFile();
        if (!file.exists() || !file.isFile()) {
            return ResponseEntity.notFound().build();
        }

        org.springframework.core.io.Resource resource;
        try {
            resource = new UrlResource(file.toURI());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid image path.", e);
        }

        String contentType;
        try {
            contentType = Files.probeContentType(normalizedPath);
        } catch (java.io.IOException e) {
            contentType = null;
        }
        if (contentType == null || !contentType.startsWith("image/")) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic())
                .body(resource);
    }
}
