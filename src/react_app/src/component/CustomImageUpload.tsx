import React, { useState } from 'react';
import { Upload, Modal } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface CustomImageUploadProps {
  maxCount?: number;
  disabled?: boolean;
  fileList?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const CustomImageUpload = ({ maxCount = 5, disabled = false, fileList: propFileList, onChange }: CustomImageUploadProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(propFileList ?? []);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf('/') + 1) || '');
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onChange?.(newFileList);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false}
        disabled={disabled}
        maxCount={maxCount}
        accept="image/*"
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
