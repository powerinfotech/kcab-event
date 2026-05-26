export interface GalleryImage {
  fileDtlSeq: number;
  fileSeq: number;
  fileNm: string;
  filePath: string;
  fileUrl?: string | null;
  fileType?: string | null;
  sortSeq: number;
}

export interface GalleryListItem {
  gallerySeq: number;
  title: string;
  galleryYear: number;
  description?: string | null;
  fileSeq?: number | null;
  imageCount: number;
  coverFileDtlSeq?: number | null;
  coverFilePath?: string | null;
  coverFileUrl?: string | null;
  sortSeq: number;
  useYn: string;
  rgstUserName?: string | null;
  rgstDateTime?: string | null;
  uptUserName?: string | null;
  uptDateTime?: string | null;
  images?: GalleryImage[];
}

export interface GalleryDetail extends GalleryListItem {
  rgstUserSeq?: number | null;
  uptUserSeq?: number | null;
}

export interface GallerySavePayload {
  title: string;
  description?: string | null;
  fileSeq?: number | null;
  sortSeq: number;
  useYn: string;
}

export interface GallerySearchParams {
  useYn?: string;
  keyword?: string;
}
