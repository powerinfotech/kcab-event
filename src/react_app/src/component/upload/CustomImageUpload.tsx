import { message } from '@util/antdMessage';
/**
 * CustomImageUpload - 이미지 업로드 + 미리보기 컴포넌트
 *
 * [목적]
 * 이미지 파일만 선택 가능한 업로드 컴포넌트다. 썸네일 미리보기와 클릭 시 원본 크기 모달 미리보기를 제공한다.
 *
 * [주요 기능]
 * - image/* 형식만 허용 (비이미지 파일 차단)
 * - 썸네일 picture-card 리스트 표시
 * - 클릭 시 모달에서 원본 크기 미리보기
 * - maxCount 초과 시 업로드 버튼 자동 숨김
 *
 * @param maxCount    - 최대 이미지 개수 (기본: 5)
 * @param disabled    - 업로드 비활성화 여부 (기본: false)
 * @param fileList    - 초기 파일 목록 (controlled)
 * @param onChange    - 파일 목록 변경 시 UploadFile[] 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomImageUpload from '@component/upload/CustomImageUpload';
 * import type { UploadFile } from 'antd';
 *
 * const [images, setImages] = useState<UploadFile[]>([]);
 *
 * // 기본 이미지 업로드
 * <CustomImageUpload
 *   fileList={images}
 *   onChange={setImages}
 *   maxCount={3}
 * />
 *
 * // 읽기 전용
 * <CustomImageUpload fileList={images} disabled />
 */
import React, {useState} from 'react';
import {Modal, Upload} from 'antd';
import type {UploadFile, UploadProps} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import type {RcFile} from 'antd/es/upload/interface';

interface CustomImageUploadProps {
  maxCount?: number;
  disabled?: boolean;
  fileList?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
}

type ImageUploadFile = UploadFile & {
  fileDtlSeq?: number;
  filePath?: string;
  fileUrl?: string;
};

const isBrowserReadableUrl = (url?: string): boolean => {
  if (!url) return false;
  return /^(https?:|data:|blob:|\/api\/|\/_next\/|\/images\/|\/uploads?\/)/i.test(url);
};

const getServerImageUrl = (file: ImageUploadFile): string | undefined => {
  if (file.fileUrl) return file.fileUrl;
  const rawPath = file.url;
  if (!rawPath) return undefined;
  if (isBrowserReadableUrl(rawPath)) return rawPath;
  return undefined;
};

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const CustomImageUpload = ({ maxCount = 5, disabled = false, fileList = [], onChange }: CustomImageUploadProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const displayFileList = fileList.map((file) => {
    const imageFile = file as ImageUploadFile;
    const imageUrl = getServerImageUrl(imageFile);
    return imageUrl ? { ...file, url: imageUrl, thumbUrl: imageUrl } : file;
  });

  const handlePreview = async (file: UploadFile) => {
    const serverImageUrl = getServerImageUrl(file as ImageUploadFile);
    if (serverImageUrl) {
      setPreviewImage(serverImageUrl);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf('/') + 1) || '');
      return;
    }
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf('/') + 1) || '');
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    onChange?.(newFileList);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={displayFileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={(file: RcFile) => {
          if (!file.type.startsWith('image/')) {
            message.error('이미지 파일만 업로드 가능합니다.');
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
        disabled={disabled}
        maxCount={maxCount}
        accept="image/*"
        showUploadList={{
          removeIcon: <DeleteOutlined />,
        }}
      >
        {fileList.length >= maxCount ? null : (
          <div>
            <PlusOutlined />
            <div className="mt8">업로드</div>
          </div>
        )}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" src={previewImage} style={{ width: '100%' }} />
      </Modal>
    </>
  );
};

export default CustomImageUpload;
