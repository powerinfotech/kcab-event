import React, { useState } from 'react';
import { message } from 'antd';
import type { UploadFile } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import CustomButton from '@component/button/CustomButton';
import CustomSpace from '@component/button/CustomSpace';
import CustomFile, { FileDetailType } from '@component/upload/CustomFile';
import CustomImageUpload from '@component/upload/CustomImageUpload';
import CustomExcelDownload from '@component/upload/CustomExcelDownload';
import CustomExcelUpload from '@component/upload/CustomExcelUpload';
import CustomTable from '@component/display/CustomTable';
import CustomTag from '@component/display/CustomTag';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';
import { callSaveFiles } from '@api/CommonApi';
import { ExcelColumnDef } from '@api/CommonExcelApi';
import { HttpStatusCode } from 'axios';

interface FileGuideProps {
  menuSeq?: number;
}

const excelColumns: ExcelColumnDef[] = [
  { headerName: 'ID', dataIndex: 'id', width: 10 },
  { headerName: '이름', dataIndex: 'name', width: 15 },
  { headerName: '부서', dataIndex: 'dept', width: 15 },
  { headerName: '직급', dataIndex: 'position', width: 12 },
  { headerName: '이메일', dataIndex: 'email', width: 25 },
  { headerName: '상태', dataIndex: 'status', width: 10 },
  { headerName: '등록일', dataIndex: 'regDate', width: 15 },
];

const excelTableColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: '10%', align: 'center' as const },
  { title: '이름', dataIndex: 'name', key: 'name', width: '15%' },
  { title: '부서', dataIndex: 'dept', key: 'dept', width: '15%', align: 'center' as const },
  { title: '직급', dataIndex: 'position', key: 'position', width: '12%', align: 'center' as const },
  { title: '이메일', dataIndex: 'email', key: 'email', width: '25%' },
  { title: '상태', dataIndex: 'status', key: 'status', width: '10%', align: 'center' as const,
    render: (val: string) => <CustomTag color={val === '활성' ? 'green' : 'default'}>{val}</CustomTag>,
  },
  { title: '등록일', dataIndex: 'regDate', key: 'regDate', width: '13%', align: 'center' as const },
];

const excelDataSource = [
  { id: 1, name: '홍길동', dept: '개발팀', position: '과장', email: 'hong@example.com', status: '활성', regDate: '2024-01-15' },
  { id: 2, name: '김철수', dept: '인사팀', position: '대리', email: 'kim@example.com', status: '활성', regDate: '2024-02-20' },
  { id: 3, name: '이영희', dept: '재무팀', position: '부장', email: 'lee@example.com', status: '비활성', regDate: '2023-11-05' },
];

const FileGuide = ({ menuSeq }: FileGuideProps) => {
  const [fileList, setFileList] = useState<FileDetailType[]>([]);
  const [fileSeq, setFileSeq] = useState<number | null>(null);
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

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
              <CustomButton type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                저장
              </CustomButton>
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
            <CustomImageUpload
              fileList={imageList}
              onChange={setImageList}
              maxCount={3}
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomImageUpload fileList={[]} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          이미지 파일만 허용 (image/*) / 썸네일 미리보기 / 클릭 시 원본 크기 모달 미리보기 / maxCount 초과 시 업로드 버튼 자동 숨김
        </div>
      </GuideDemoBox>

      {/* Excel Download / Upload */}
      <GuideDemoBox title="엑셀 다운로드/업로드 (Excel Download/Upload)">
        <CustomSpace direction="vertical" style={{ width: '100%' }} size="middle">
          <CustomSpace>
            <CustomExcelDownload
              columns={excelColumns}
              dataSource={excelDataSource}
              fileName="사용자목록"
            />
            <CustomExcelDownload
              columns={excelColumns}
              dataSource={excelDataSource}
              fileName="보고서"
              buttonText="보고서 다운로드"
            />
            <CustomExcelUpload
              columns={excelColumns}
              onUploadSuccess={setUploadedData}
            />
          </CustomSpace>
          {uploadedData.length > 0 && (
            <>
              <div style={{ fontWeight: 'bold' }}>업로드 결과 ({uploadedData.length}건):</div>
              <CustomTable
                rowKey="id"
                columns={excelTableColumns}
                dataSource={uploadedData}
                rowNoFlag
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
              />
            </>
          )}
        </CustomSpace>
        <div className="guide-demo-description">
          엑셀 다운로드: 서버사이드 생성 / 엑셀 업로드: .xlsx, .xls 허용, 파싱 후 데이터 콜백 전달
        </div>
      </GuideDemoBox>

    </GuideSection>
  );
};

export default FileGuide;
