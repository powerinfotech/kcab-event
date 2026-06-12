package com.kcabEvent.service.common.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kcabEvent.dao.FileDao;
import com.kcabEvent.dto.common.FileDetailDto;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.service.common.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

/**
 * FileServiceImpl - {@link FileService} 구현체
 *
 * <p>파일 처리 흐름:</p>
 * <ul>
 *   <li><b>업로드</b>: UUID 파일명으로 {@code ${file.path.dir}} 하위 업무별 폴더에 저장 → DB 등록</li>
 *   <li><b>다운로드</b>: 경로 탈출({@code ..}) 방지 후 {@link org.springframework.core.io.UrlResource}로 스트리밍</li>
 *   <li><b>삭제</b>: 파일 서버에서 실제 삭제하지 않고 DB에서만 논리 삭제 (파일 보존 정책)</li>
 * </ul>
 */
@Slf4j
@Service("fileService")
public class FileServiceImpl implements FileService {

    @Resource(name="fileDao")
    private FileDao fileDao;

    private final ObjectMapper objectMapper;

    @Value("${file.path.dir}")
    private String uploadDir;

    @Value("${file.url.image-prefix:/api/public/file-image}")
    private String imageUrlPrefix;

    @Value("${file.url.inline-image-prefix:/api/public/editor-image}")
    private String inlineImageUrlPrefix;

    private static final int DEFAULT_THUMBNAIL_WIDTH = 320;
    private static final int MIN_THUMBNAIL_WIDTH = 80;
    private static final int MAX_THUMBNAIL_WIDTH = 800;
    private final Object thumbnailCreationLock = new Object();

    public FileServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public List<FileDetailDto> getFileList(Integer fileSeq){
        List<FileDetailDto> fileList = fileDao.selectFile(fileSeq);
        fileList.forEach(this::applyImageUrl);
        return fileList;
    }

    @Override
    public Integer addFile(LoginUser loginUser, String insertFileMetaListJson, List<MultipartFile> insertFiles, String uploadContext) {
        if(insertFiles == null) return null;

        List<FileDetailDto> insertFileMetaList;
        try {
            insertFileMetaList = objectMapper.readValue(
                    insertFileMetaListJson,
                    new TypeReference<List<FileDetailDto>>() {}
            );
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("파일 메타 JSON 파싱 실패", e);
        }

        List<FileDetailDto> insertFileDtlList = new ArrayList<>();

        insertFiles.forEach((file) -> {
            String originalFileName = Objects.requireNonNullElse(file.getOriginalFilename(), "file");
            String extension = "";

            if (originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);
            }

            String savedFileName = UUID.randomUUID() + "_" + sanitizeFileName(originalFileName);

            Path destinationPath = buildDestinationPath(uploadContext, savedFileName, false);
            String filePath = destinationPath.toString();
            try {
                // 폴더 없을시 폴더 생성
                File destinationFile = destinationPath.toFile();
                File parentDir = destinationFile.getParentFile();
                if (!parentDir.exists()) {
                    boolean created = parentDir.mkdirs();
                    if (!created) {
                        throw new IOException("업로드 디렉토리 생성 실패: " + parentDir.getAbsolutePath());
                    }
                }

                // 파일전송
                file.transferTo(destinationFile);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            FileDetailDto fileMeta = insertFileMetaList.stream()
                    .filter(m -> m.getFileNm().equals(originalFileName))
                    .findFirst()
                    .orElse(null);

            /* tb_file_dtl 테이블에 insert하기 위한 dto 생성 */
            FileDetailDto insertFileDtl = new FileDetailDto();

            if (fileMeta == null) {
                throw new com.kcabEvent.exception.custom.BusinessException("파일 메타데이터를 찾을 수 없습니다: " + originalFileName);
            }
            insertFileDtl.setFileSeq(fileMeta.getFileSeq());
            insertFileDtl.setMenuSeq(fileMeta.getMenuSeq());
            insertFileDtl.setFileNm(originalFileName);
            insertFileDtl.setFilePath(filePath);
            insertFileDtl.setFileType(extension);
            insertFileDtl.setSortSeq(fileMeta.getSortSeq());

            insertFileDtlList.add(insertFileDtl);
        });

        Integer fileSeq = null;

        if(!insertFileDtlList.isEmpty()){
            fileSeq = insertFileDtlList.get(0).getFileSeq();

            for(FileDetailDto fileDto : insertFileDtlList){
                fileDto.setRgstUserSeq(loginUser.getUserSeq());
                fileDto.setUptUserSeq(loginUser.getUserSeq());

                if(fileSeq == null && !fileDao.checkExistFileSeq(fileDto.getFileSeq())){
                    fileDao.insertFile(fileDto);
                    fileSeq = fileDto.getFileSeq();
                }

                fileDto.setFileSeq(fileSeq);
                fileDao.insertFileDetail(fileDto);
            }
        }

        return fileSeq;
    }

    @Override
    public void updateFile(LoginUser loginUser, String updateFileListJson){
        if (updateFileListJson == null) return;

        List<FileDetailDto> updateFileList;
        try {
            updateFileList = objectMapper.readValue(updateFileListJson, new TypeReference<List<FileDetailDto>>() {});
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("파일 메타 JSON 파싱 실패", e);
        }

        for (FileDetailDto fileDto : updateFileList) {
            fileDto.setUptUserSeq(loginUser.getUserSeq());

            fileDao.updateFileDetail(fileDto);
        }
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(String filePath){
        // 경로 탈출 방지: 정규화 후 uploadDir 하위인지 검증
        Path uploadDirPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path normalizedPath = Paths.get(filePath).toAbsolutePath().normalize();
        if (!normalizedPath.startsWith(uploadDirPath)) {
            return ResponseEntity.badRequest().build();
        }

        File file = normalizedPath.toFile();

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        org.springframework.core.io.Resource resource;
        try {
            resource = new UrlResource(file.toURI());
        } catch (java.net.MalformedURLException e) {
            throw new RuntimeException("잘못된 파일 경로: " + filePath, e);
        }

        String encodedFileName = URLEncoder.encode(file.getName(), StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"")
                .body(resource);
    }

    @Override
    public void deleteFile(LoginUser loginUser, String deleteFileListJson){
        if (deleteFileListJson == null) return;

        List<FileDetailDto> deleteFileList;
        try {
            deleteFileList = objectMapper.readValue(deleteFileListJson, new TypeReference<List<FileDetailDto>>() {});
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("파일 메타 JSON 파싱 실패", e);
        }

        for (FileDetailDto fileDto : deleteFileList) {
            File file = new File(fileDto.getFilePath());
            if (file.exists()) {
                //파일 서버에서 삭제하지 말고 남기도록 주석처리
                file.delete();
            }

            fileDto.setUptUserSeq(loginUser.getUserSeq());

            fileDao.deleteFileDetail(fileDto);
        }
    }

    @Override
    public FileDetailDto uploadInlineImage(LoginUser loginUser, MultipartFile file, String uploadContext) {
        if (file == null || file.isEmpty()) {
            throw new com.kcabEvent.exception.custom.BusinessException("업로드할 이미지가 없습니다.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new com.kcabEvent.exception.custom.BusinessException("이미지 파일만 업로드할 수 있습니다.");
        }

        String originalFileName = Objects.requireNonNullElse(file.getOriginalFilename(), "image");
        String extension = "";
        if (originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf('.') + 1);
        }
        String savedFileName = UUID.randomUUID() + "_" + sanitizeFileName(originalFileName);
        Path destinationPath = buildDestinationPath(uploadContext, savedFileName, true);
        String filePath = destinationPath.toString();

        try {
            File destination = destinationPath.toFile();
            File parent = destination.getParentFile();
            if (parent != null && !parent.exists() && !parent.mkdirs()) {
                throw new IOException("업로드 디렉토리 생성 실패: " + parent.getAbsolutePath());
            }
            file.transferTo(destination);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        FileDetailDto group = new FileDetailDto();
        group.setMenuSeq(null);
        group.setRgstUserSeq(loginUser != null ? loginUser.getUserSeq() : null);
        group.setUptUserSeq(loginUser != null ? loginUser.getUserSeq() : null);
        fileDao.insertFile(group);

        FileDetailDto detail = new FileDetailDto();
        detail.setFileSeq(group.getFileSeq());
        detail.setFileNm(originalFileName);
        detail.setFilePath(filePath);
        detail.setFileType(extension);
        detail.setSortSeq(0);
        detail.setRgstUserSeq(loginUser != null ? loginUser.getUserSeq() : null);
        detail.setUptUserSeq(loginUser != null ? loginUser.getUserSeq() : null);
        fileDao.insertFileDetail(detail);
        detail.setFileUrl(buildPublicUrl(inlineImageUrlPrefix, detail.getFileDtlSeq()));
        return detail;
    }

    @Override
    public FileDetailDto getFileDetailBySeq(Integer fileDtlSeq) {
        return applyImageUrl(fileDao.selectFileDetailBySeq(fileDtlSeq));
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> streamInlineFile(Integer fileDtlSeq) {
        FileDetailDto detail = fileDao.selectFileDetailBySeq(fileDtlSeq);
        if (detail == null) {
            return ResponseEntity.notFound().build();
        }
        Path uploadDirPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path normalizedPath = Paths.get(detail.getFilePath()).toAbsolutePath().normalize();
        if (!normalizedPath.startsWith(uploadDirPath)) {
            return ResponseEntity.badRequest().build();
        }
        File file = normalizedPath.toFile();
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        org.springframework.core.io.Resource resource;
        try {
            resource = new UrlResource(file.toURI());
        } catch (java.net.MalformedURLException e) {
            throw new RuntimeException("잘못된 파일 경로", e);
        }
        MediaType mediaType = guessImageMediaType(detail.getFileType());
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000")
                .body(resource);
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> streamImageThumbnail(Integer fileDtlSeq, Integer width) {
        FileDetailDto detail = fileDao.selectFileDetailBySeq(fileDtlSeq);
        if (detail == null) {
            return ResponseEntity.notFound().build();
        }
        if (!isImageExtension(detail.getFileType())) {
            return ResponseEntity.badRequest().build();
        }

        Path uploadDirPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path normalizedPath = Paths.get(detail.getFilePath()).toAbsolutePath().normalize();
        if (!normalizedPath.startsWith(uploadDirPath)) {
            return ResponseEntity.badRequest().build();
        }
        File sourceFile = normalizedPath.toFile();
        if (!sourceFile.exists()) {
            return ResponseEntity.notFound().build();
        }

        int thumbnailWidth = normalizeThumbnailWidth(width);
        try {
            Path thumbnailPath = buildThumbnailPath(uploadDirPath, detail, thumbnailWidth);
            File thumbnailFile = thumbnailPath.toFile();
            if (!thumbnailFile.exists() || thumbnailFile.lastModified() < sourceFile.lastModified()) {
                synchronized (thumbnailCreationLock) {
                    if (!thumbnailFile.exists() || thumbnailFile.lastModified() < sourceFile.lastModified()) {
                        createThumbnail(sourceFile, thumbnailPath, thumbnailWidth);
                    }
                }
            }

            org.springframework.core.io.Resource resource = new UrlResource(thumbnailFile.toURI());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000")
                    .body(resource);
        } catch (IOException e) {
            log.warn("Failed to create thumbnail for fileDtlSeq={}", fileDtlSeq, e);
            return streamInlineFile(fileDtlSeq);
        }
    }

    private MediaType guessImageMediaType(String extension) {
        if (extension == null) return MediaType.APPLICATION_OCTET_STREAM;
        return switch (extension.toLowerCase()) {
            case "png" -> MediaType.IMAGE_PNG;
            case "gif" -> MediaType.IMAGE_GIF;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "webp" -> MediaType.valueOf("image/webp");
            case "svg" -> MediaType.valueOf("image/svg+xml");
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    private FileDetailDto applyImageUrl(FileDetailDto detail) {
        if (detail != null && isImageExtension(detail.getFileType())) {
            detail.setFileUrl(buildPublicUrl(imageUrlPrefix, detail.getFileDtlSeq()));
        }
        return detail;
    }

    private boolean isImageExtension(String extension) {
        if (extension == null) return false;
        return switch (extension.toLowerCase()) {
            case "png", "gif", "jpg", "jpeg", "webp", "svg", "bmp" -> true;
            default -> false;
        };
    }

    private int normalizeThumbnailWidth(Integer width) {
        int requested = width == null ? DEFAULT_THUMBNAIL_WIDTH : width;
        return Math.max(MIN_THUMBNAIL_WIDTH, Math.min(MAX_THUMBNAIL_WIDTH, requested));
    }

    private Path buildThumbnailPath(Path uploadDirPath, FileDetailDto detail, int width) throws IOException {
        Path thumbnailDir = uploadDirPath.resolve("thumbnails").normalize();
        if (!thumbnailDir.startsWith(uploadDirPath)) {
            throw new IOException("Invalid thumbnail path.");
        }
        Files.createDirectories(thumbnailDir);
        return thumbnailDir.resolve(detail.getFileDtlSeq() + "_" + width + ".jpg").normalize();
    }

    private void createThumbnail(File sourceFile, Path thumbnailPath, int targetWidth) throws IOException {
        BufferedImage source = ImageIO.read(sourceFile);
        if (source == null) {
            throw new IOException("Unsupported image format.");
        }

        double ratio = Math.min(1.0, (double) targetWidth / source.getWidth());
        int outputWidth = Math.max(1, (int) Math.round(source.getWidth() * ratio));
        int outputHeight = Math.max(1, (int) Math.round(source.getHeight() * ratio));

        BufferedImage thumbnail = new BufferedImage(outputWidth, outputHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = thumbnail.createGraphics();
        try {
            graphics.setColor(Color.WHITE);
            graphics.fillRect(0, 0, outputWidth, outputHeight);
            graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            graphics.drawImage(source, 0, 0, outputWidth, outputHeight, null);
        } finally {
            graphics.dispose();
        }

        if (!ImageIO.write(thumbnail, "jpg", thumbnailPath.toFile())) {
            throw new IOException("No JPEG writer available.");
        }
    }

    private String buildPublicUrl(String prefix, Integer fileDtlSeq) {
        if (fileDtlSeq == null) return null;
        String normalizedPrefix = prefix == null || prefix.isBlank()
                ? "/api/public/file-image"
                : prefix.trim();
        if (normalizedPrefix.endsWith("/")) {
            normalizedPrefix = normalizedPrefix.substring(0, normalizedPrefix.length() - 1);
        }
        return normalizedPrefix + "/" + fileDtlSeq;
    }

    private Path buildDestinationPath(String uploadContext, String savedFileName, boolean inlineImage) {
        Path uploadDirPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path destinationPath = uploadDirPath
                .resolve(resolveUploadSubDirectory(uploadContext, inlineImage))
                .resolve(savedFileName)
                .normalize();
        if (!destinationPath.startsWith(uploadDirPath)) {
            throw new com.kcabEvent.exception.custom.BusinessException("잘못된 업로드 경로입니다.");
        }
        return destinationPath;
    }

    private String resolveUploadSubDirectory(String uploadContext, boolean inlineImage) {
        String context = uploadContext == null
                ? ""
                : uploadContext.trim().toUpperCase(Locale.ROOT).replace('-', '_');
        String baseFolder = switch (context) {
            case "EVENT_EMAIL_HEADER" -> "events/email-header";
            case "EVENT_ATTACHMENT" -> "events/attachments";
            case "EVENT_PAGE_HERO" -> "event-pages/hero";
            case "EVENT_PAGE_BLOCK_IMAGE" -> "event-pages/blocks/images";
            case "EVENT_PAGE_BLOCK_ATTACHMENT" -> "event-pages/blocks/attachments";
            case "NOTICE_NEWS_ATTACHMENT" -> "notice-news/attachments";
            case "GALLERY_IMAGE" -> "gallery";
            case "SPONSOR_LOGO" -> "sponsors/logos";
            case "ORGANIZATION_IMAGE" -> "organizations/images";
            case "EDITOR_EVENT" -> "editor/events";
            case "EDITOR_NOTICE_NEWS" -> "editor/notice-news";
            case "EDITOR_EMAIL_CMS" -> "editor/email-cms";
            case "EDITOR_GUIDE" -> "editor/guide";
            case "GUIDE_FILE" -> "guide/files";
            default -> inlineImage ? "editor/common" : "common/files";
        };
        LocalDate today = LocalDate.now();
        return baseFolder
                + File.separator + today.getYear()
                + File.separator + String.format("%02d", today.getMonthValue());
    }

    private String sanitizeFileName(String fileName) {
        String fallback = fileName == null || fileName.isBlank() ? "file" : fileName;
        return fallback.replaceAll("[\\\\/:*?\"<>|]", "_");
    }

    @Override
    public void deleteAllFile(LoginUser loginUser, Integer fileSeq){
        List<FileDetailDto> existFileList = fileDao.selectFile(fileSeq);

        if(existFileList.isEmpty()) return;

        for(FileDetailDto fileDto : existFileList){
            File file = new File(fileDto.getFilePath());
            if (file.exists()) {
                //파일 서버에서 삭제하지 말고 남기도록 주석처리
                file.delete();
            }

            fileDto.setUptUserSeq(loginUser.getUserSeq());

            fileDao.deleteFileDetail(fileDto);
        }

        FileDetailDto deleteFileDto = new FileDetailDto();
        deleteFileDto.setUptUserSeq(loginUser.getUserSeq());
        deleteFileDto.setFileSeq(fileSeq);

        fileDao.deleteFile(deleteFileDto);
    }
}
