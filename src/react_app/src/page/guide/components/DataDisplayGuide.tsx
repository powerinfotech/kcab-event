import React, { useState } from 'react';
import { Empty } from 'antd';
import CustomTable, { IUD_COLUMN } from '@component/display/CustomTable';
import CustomTag from '@component/display/CustomTag';
import CustomBadge from '@component/display/CustomBadge';
import CustomTimeline from '@component/display/CustomTimeline';
import CustomStatistic from '@component/display/CustomStatistic';
import CustomCard from '@component/display/CustomCard';
import CustomDescriptions, { CustomDescriptionsItem } from '@component/display/CustomDescriptions';
import CustomDirectoryTree from '@component/display/CustomDirectoryTree';
import CustomCollapse from '@component/display/CustomCollapse';
import CustomEmpty from '@component/display/CustomEmpty';
import CustomProgress from '@component/display/CustomProgress';
import CustomButton from '@component/button/CustomButton';
import CustomSpace from '@component/button/CustomSpace';
import CustomExcelDownload from '@component/upload/CustomExcelDownload';
import CustomExcelUpload from '@component/upload/CustomExcelUpload';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { GuideSection, GuideDemoBox } from './GuideSection';
import { ExcelColumnDef } from '@api/CommonExcelApi';

const tableColumns = [
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

const tableData = [
  { id: 1, name: '홍길동', dept: '개발팀', position: '과장', email: 'hong@example.com', status: '활성', regDate: '2024-01-15' },
  { id: 2, name: '김철수', dept: '인사팀', position: '대리', email: 'kim@example.com', status: '활성', regDate: '2024-02-20' },
  { id: 3, name: '이영희', dept: '재무팀', position: '부장', email: 'lee@example.com', status: '비활성', regDate: '2023-11-05' },
  { id: 4, name: '박지민', dept: '기획팀', position: '사원', email: 'park@example.com', status: '활성', regDate: '2024-03-10' },
  { id: 5, name: '최수진', dept: '개발팀', position: '차장', email: 'choi@example.com', status: '활성', regDate: '2023-09-01' },
];

const excelColumns: ExcelColumnDef[] = [
  { headerName: 'ID', dataIndex: 'id', width: 10 },
  { headerName: '이름', dataIndex: 'name', width: 15 },
  { headerName: '부서', dataIndex: 'dept', width: 15 },
  { headerName: '직급', dataIndex: 'position', width: 12 },
  { headerName: '이메일', dataIndex: 'email', width: 25 },
  { headerName: '상태', dataIndex: 'status', width: 10 },
  { headerName: '등록일', dataIndex: 'regDate', width: 15 },
];

const treeData = [
  {
    title: '시스템관리',
    key: '0',
    children: [
      {
        title: '사용자관리',
        key: '0-0',
        children: [
          { title: '사용자 목록', key: '0-0-0', isLeaf: true },
          { title: '권한 관리', key: '0-0-1', isLeaf: true },
        ],
      },
      {
        title: '코드관리',
        key: '0-1',
        children: [
          { title: '공통코드', key: '0-1-0', isLeaf: true },
          { title: '그룹코드', key: '0-1-1', isLeaf: true },
        ],
      },
    ],
  },
  {
    title: '업무관리',
    key: '1',
    children: [
      { title: '게시판', key: '1-0', isLeaf: true },
      { title: '결재관리', key: '1-1', isLeaf: true },
    ],
  },
];

const iudTableColumns = [
  IUD_COLUMN,
  { title: '이름', dataIndex: 'name', key: 'name', width: '20%' },
  { title: '부서', dataIndex: 'dept', key: 'dept', width: '20%', align: 'center' as const },
  { title: '직급', dataIndex: 'position', key: 'position', width: '20%', align: 'center' as const },
  { title: '이메일', dataIndex: 'email', key: 'email' },
];

const iudTableData = [
  { id: 1, iudType: 'I', name: '신규등록자', dept: '개발팀', position: '사원', email: 'new@example.com' },
  { id: 2, iudType: 'U', name: '홍길동', dept: '개발팀', position: '과장', email: 'hong@example.com' },
  { id: 3, iudType: 'D', name: '삭제대상자', dept: '인사팀', position: '대리', email: 'del@example.com' },
  { id: 4, iudType: null, name: '변경없음', dept: '기획팀', position: '부장', email: 'none@example.com' },
];

const collapseItems = [
  { key: '1', label: '검색 필터', children: <p>날짜, 키워드, 상태 등 필터 영역이 들어갑니다.</p> },
  { key: '2', label: '고급 설정', children: <p>추가적인 설정 옵션이 들어갑니다.</p> },
  { key: '3', label: '도움말', children: <p>해당 화면의 사용 방법을 안내합니다.</p> },
];

const DataDisplayGuide = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  return (
    <GuideSection id="data-display" title="데이터 표시 (Data Display)" description="그리드, 트리, 카드, 태그 등 데이터 표시 컴포넌트">
      {/* DataGrid / DataTable */}
      <GuideDemoBox title="DataGrid / DataTable (CustomTable)">
        <div className="guide-sub-section">
          <h5>기본 (rowNoFlag — 오름차순 행 번호)</h5>
          <CustomTable
            rowKey="id"
            columns={tableColumns}
            dataSource={tableData}
            rowNoFlag
            pagination={{ pageSize: 5 }}
            scroll={{ x: 800 }}
          />
        </div>
        <div className="guide-sub-section">
          <h5>rowNoDescFlag — 내림차순 행 번호</h5>
          <CustomTable
            rowKey="id"
            columns={tableColumns}
            dataSource={tableData}
            rowNoDescFlag
            pagination={{ pageSize: 5, total: tableData.length }}
            scroll={{ x: 800 }}
          />
        </div>
        <div className="guide-sub-section">
          <h5>IUD_COLUMN — 신규/수정/삭제 상태 아이콘</h5>
          <CustomTable
            rowKey="id"
            columns={iudTableColumns}
            dataSource={iudTableData}
            pagination={false}
            scroll={{ x: 600 }}
          />
        </div>
        <div className="guide-sub-section">
          <h5>rowSelectedFlag — 클릭 행 강조</h5>
          <CustomTable
            rowKey="id"
            columns={tableColumns}
            dataSource={tableData}
            rowNoFlag
            rowSelectedFlag
            pagination={false}
            scroll={{ x: 800 }}
          />
        </div>
      </GuideDemoBox>

      {/* 엑셀 다운로드/업로드 */}
      <GuideDemoBox title="엑셀 다운로드/업로드 (Excel Download/Upload)">
        <CustomSpace orientation="vertical" style={{ width: '100%' }} size="middle">
          <CustomSpace>
            <CustomExcelDownload
              columns={excelColumns}
              dataSource={tableData}
              fileName="사용자목록"
            />
            <CustomExcelUpload
              columns={excelColumns}
              onUploadSuccess={setUploadedData}
            />
          </CustomSpace>
          {uploadedData.length > 0 && (
            <>
              <div style={{ fontWeight: 'bold' }}>업로드 결과:</div>
              <CustomTable
                rowKey="id"
                columns={tableColumns}
                dataSource={uploadedData}
                rowNoFlag
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
              />
            </>
          )}
        </CustomSpace>
      </GuideDemoBox>

      {/* TreeGrid */}
      <GuideDemoBox title="TreeGrid / Tree (트리형)">
        <CustomDirectoryTree
          showLine
          defaultExpandAll
          treeData={treeData}
        />
      </GuideDemoBox>

      {/* Card / CardList */}
      <GuideDemoBox title="Card / CardList (카드형 목록)">
        <div className="guide-card-row">
          <CustomCard title="사용자 현황" extra={<a href="#">더보기</a>}>
            <p>전체 사용자: 1,234명</p>
            <p>활성 사용자: 1,100명</p>
          </CustomCard>
          <CustomCard title="시스템 상태" extra={<CustomBadge status="success" text="정상" />}>
            <p>CPU: 45%</p>
            <p>Memory: 62%</p>
          </CustomCard>
          <CustomCard title="최근 공지" hoverable>
            <p>시스템 정기 점검 안내</p>
            <p>2024-03-20 예정</p>
          </CustomCard>
        </div>
      </GuideDemoBox>

      {/* DescriptionList */}
      <GuideDemoBox title="DescriptionList (상세 정보)">
        <CustomDescriptions bordered column={2}>
          <CustomDescriptionsItem label="이름">홍길동</CustomDescriptionsItem>
          <CustomDescriptionsItem label="부서">개발팀</CustomDescriptionsItem>
          <CustomDescriptionsItem label="직급">과장</CustomDescriptionsItem>
          <CustomDescriptionsItem label="이메일">hong@example.com</CustomDescriptionsItem>
          <CustomDescriptionsItem label="전화번호">010-1234-5678</CustomDescriptionsItem>
          <CustomDescriptionsItem label="입사일">2020-03-15</CustomDescriptionsItem>
          <CustomDescriptionsItem label="비고" span={2}>
            시스템 관리자 권한 보유
          </CustomDescriptionsItem>
        </CustomDescriptions>
      </GuideDemoBox>

      {/* Tag / Badge */}
      <GuideDemoBox title="Tag / Badge (상태 표시)">
        <div className="guide-sub-section">
          <h5>Tag</h5>
          <div className="guide-demo-row">
            <CustomTag>기본</CustomTag>
            <CustomTag color="success" icon={<CheckCircleOutlined />}>완료</CustomTag>
            <CustomTag color="processing" icon={<SyncOutlined spin />}>진행중</CustomTag>
            <CustomTag color="warning" icon={<ClockCircleOutlined />}>대기</CustomTag>
            <CustomTag color="error" icon={<CloseCircleOutlined />}>오류</CustomTag>
            <CustomTag color="#FFDD00">커스텀</CustomTag>
          </div>
        </div>
        <div className="guide-sub-section">
          <h5>Tag (closable — 닫기 가능)</h5>
          <div className="guide-demo-row">
            <CustomTag closable>닫기 가능</CustomTag>
            <CustomTag closable color="success">완료</CustomTag>
            <CustomTag closable color="processing">진행중</CustomTag>
            <CustomTag closable color="error">오류</CustomTag>
          </div>
        </div>
        <div className="guide-sub-section">
          <h5>Badge</h5>
          <div className="guide-demo-row">
            <CustomBadge count={5}><div className="guide-badge-placeholder">알림</div></CustomBadge>
            <CustomBadge count={99}><div className="guide-badge-placeholder">메시지</div></CustomBadge>
            <CustomBadge count={200} overflowCount={99}><div className="guide-badge-placeholder">overflow</div></CustomBadge>
            <CustomBadge dot><div className="guide-badge-placeholder">업데이트</div></CustomBadge>
            <CustomBadge status="success" text="성공" />
            <CustomBadge status="error" text="실패" />
            <CustomBadge status="processing" text="처리중" />
          </div>
        </div>
      </GuideDemoBox>

      {/* Timeline */}
      <GuideDemoBox title="Timeline (이력/타임라인)">
        <div className="guide-timeline-wrap">
          <CustomTimeline
            items={[
              { color: 'green', content: '시스템 배포 완료 (2024-03-20 14:00)' },
              { color: 'blue', content: '테스트 승인 (2024-03-19 10:30)' },
              { color: 'blue', content: 'QA 테스트 시작 (2024-03-18 09:00)' },
              { color: 'gray', content: '개발 완료 (2024-03-15 18:00)' },
              { color: 'gray', content: '요구사항 확정 (2024-03-10 11:00)' },
            ]}
          />
        </div>
      </GuideDemoBox>

      {/* Collapse */}
      <GuideDemoBox title="Collapse (아코디언)">
        <div className="guide-sub-section">
          <h5>기본 아코디언</h5>
          <CustomCollapse
            defaultActiveKey={['1']}
            items={[
              {
                key: '1',
                label: '검색 필터',
                children: (
                  <p>검색 조건 영역입니다. 펼쳤다 접을 수 있는 필터 패널에 활용합니다.</p>
                ),
              },
              {
                key: '2',
                label: '고급 설정',
                children: (
                  <p>추가 설정 영역입니다. 자주 사용하지 않는 옵션을 숨길 때 유용합니다.</p>
                ),
              },
              {
                key: '3',
                label: '도움말',
                children: (
                  <p>도움말 내용입니다. 사용자 안내 텍스트를 접어둘 때 사용합니다.</p>
                ),
              },
            ]}
          />
        </div>
        <div className="guide-sub-section">
          <h5>accordion 모드 (하나만 열림)</h5>
          <CustomCollapse
            accordion
            items={[
              { key: '1', label: '항목 1', children: <p>항목 1 내용 — accordion 모드에서는 하나만 열립니다.</p> },
              { key: '2', label: '항목 2', children: <p>항목 2 내용</p> },
              { key: '3', label: '항목 3', children: <p>항목 3 내용</p> },
            ]}
          />
        </div>
        <div className="guide-sub-section">
          <h5>테두리 없음</h5>
          <CustomCollapse
            bordered={false}
            defaultActiveKey={['1']}
            items={[
              { key: '1', label: '테두리 없는 패널', children: <p>bordered=false 옵션으로 테두리를 제거합니다.</p> },
              { key: '2', label: '패널 2', children: <p>내용 영역</p> },
            ]}
          />
        </div>
      </GuideDemoBox>

      {/* Statistic */}
      <GuideDemoBox title="Statistic (숫자 통계 카드)">
        <div className="guide-stat-row">
          <div>
            <CustomStatistic title="전체 사용자" value={1234} />
          </div>
          <div>
            <CustomStatistic title="금일 접속자" value={89} prefix={<ArrowUpOutlined />} styles={{ content: { color: '#3f8600' } }} />
          </div>
          <div>
            <CustomStatistic title="오류 건수" value={3} prefix={<ArrowDownOutlined />} styles={{ content: { color: '#cf1322' } }} />
          </div>
          <div>
            <CustomStatistic title="처리율" value={93.5} suffix="%" precision={1} />
          </div>
        </div>
      </GuideDemoBox>

      {/* Collapse */}
      <GuideDemoBox title="Collapse (아코디언 / 접기·펼치기)">
        <div className="guide-sub-section">
          <h5>기본 (items API)</h5>
          <CustomCollapse items={collapseItems} defaultActiveKey={['1']} />
        </div>
        <div className="guide-sub-section">
          <h5>Accordion (하나만 열림)</h5>
          <CustomCollapse items={collapseItems} accordion />
        </div>
        <div className="guide-sub-section">
          <h5>테두리 없음 (bordered={false})</h5>
          <CustomCollapse items={collapseItems} bordered={false} />
        </div>
        <div className="guide-sub-section">
          <h5>Panel 방식 (items API)</h5>
          <CustomCollapse
            defaultActiveKey={['p1']}
            items={[
              { key: 'p1', label: '기본 정보', children: <p>이름, 부서, 직급 등 기본 정보가 들어갑니다.</p> },
              { key: 'p2', label: '추가 정보', children: <p>비고, 첨부파일 등 추가 정보가 들어갑니다.</p> },
            ]}
          />
        </div>
      </GuideDemoBox>

      {/* Progress */}
      <GuideDemoBox title="Progress (진행률 표시)">
        <div className="guide-sub-section">
          <h5>Line (선형)</h5>
          <CustomSpace orientation="vertical" style={{ width: '100%' }}>
            <CustomProgress percent={70} />
            <CustomProgress percent={100} status="success" />
            <CustomProgress percent={45} status="exception" />
            <CustomProgress percent={50} strokeColor="#722ed1" />
          </CustomSpace>
        </div>
        <div className="guide-sub-section">
          <h5>Circle / Dashboard</h5>
          <div className="guide-demo-row">
            <CustomProgress type="circle" percent={75} />
            <CustomProgress type="circle" percent={100} status="success" />
            <CustomProgress type="circle" percent={40} status="exception" />
            <CustomProgress type="dashboard" percent={80} />
          </div>
        </div>
        <div className="guide-sub-section">
          <h5>Steps (단계별)</h5>
          <CustomProgress steps={5} percent={60} />
        </div>
      </GuideDemoBox>

      {/* Empty */}
      <GuideDemoBox title="Empty (빈 상태)">
        <div className="guide-sub-section">
          <h5>기본</h5>
          <CustomEmpty />
        </div>
        <div className="guide-sub-section">
          <h5>설명 문구 변경</h5>
          <CustomEmpty description="검색 결과가 없습니다." />
        </div>
        <div className="guide-sub-section">
          <h5>Simple 이미지</h5>
          <CustomEmpty image={Empty.PRESENTED_IMAGE_SIMPLE} description="데이터 없음" />
        </div>
        <div className="guide-sub-section">
          <h5>액션 버튼 포함</h5>
          <CustomEmpty description="등록된 데이터가 없습니다.">
            <CustomButton type="primary">새로 등록</CustomButton>
          </CustomEmpty>
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default DataDisplayGuide;
