export interface GalleryImage {
  fileDtlSeq: number;
  fileSeq: number;
  fileNm: string;
  filePath: string;
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
  coverFilePath?: string | null;
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
  galleryYear: number;
  description?: string | null;
  fileSeq?: number | null;
  sortSeq: number;
  useYn: string;
}

export interface GallerySearchParams {
  galleryYear?: number | '';
  useYn?: string;
  keyword?: string;
}
