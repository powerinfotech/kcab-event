import React, { useState } from 'react';
import { Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import CustomFile, { FileDetailType } from '@component/upload/CustomFile';
import CustomImageUpload from '@component/upload/CustomImageUpload';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';
import { callSaveFiles } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';

interface FileGuideProps {
  menuSeq?: number;
}

const FileGuide = ({ menuSeq }: FileGuideProps) => {
  const [fileList, setFileList] = useState<FileDetailType[]>([]);
  const [fileSeq, setFileSeq] = useState<number | null>(null);

  const handleSave = async () => {
    if (!menuSeq) {
      message.error('메뉴 정보를 불러올 수 없습니다.');
      return;
    }

    try {
      const res = await callSaveFiles(fileSeq, menuSeq, fileList);
      if (res.code === HttpStatusCode.Ok) {
        message.success('파일이 저장되었습니다.');
        setFileSeq(res.item.fileSeq);
        setFileList(res.item.fileList ?? []);
      } else {
        message.error('파일 저장에 실패했습니다.');
      }
    } catch {
      message.error('파일 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <GuideSection id="file" title="파일 관련 (File)" description="파일 업로드, 드래그앤드롭, 이미지 업로드 컴포넌트">
      {/* FileUpload / DragDropUpload */}
      <GuideDemoBox title="FileUpload / DragDropUpload (CustomFile)">
        <GuideStatusRow>
          <GuideStatusItem label="편집 모드">
            <CustomFile
              fileList={fileList}
              onFileListChange={setFileList}
              isEditable
            />
            <div style={{ marginTop: 8 }}>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                저장
              </Button>
            </div>
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          드래그앤드롭 정렬 지원 / 최대 5개, 10MB 제한 / 파일 다운로드 및 삭제 가능
        </div>
      </GuideDemoBox>

      <GuideDemoBox title="FileUpload (읽기 전용)">
        <GuideStatusRow>
          <GuideStatusItem label="readOnly (파일 없음)">
            <CustomFile
              fileList={[]}
              onFileListChange={() => {}}
              isEditable={false}
            />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* ImageUpload */}
      <GuideDemoBox title="ImageUpload (이미지 업로드)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled (최대 3장)">
            <CustomImageUpload maxCount={3} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomImageUpload disabled />
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          이미지 파일만 허용 (image/*) / 썸네일 미리보기 / 클릭하여 원본 크기 확대 가능 / maxCount 초과 시 업로드 버튼 자동 숨김
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default FileGuide;
