import React from 'react';
import { Tag, Badge, Timeline, Statistic, Card, Descriptions, Tree } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import CustomTable from '@component/CustomTable';
import { GuideSection, GuideDemoBox } from './GuideSection';

const tableColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: '10%', align: 'center' as const },
  { title: '이름', dataIndex: 'name', key: 'name', width: '15%' },
  { title: '부서', dataIndex: 'dept', key: 'dept', width: '15%', align: 'center' as const },
  { title: '직급', dataIndex: 'position', key: 'position', width: '12%', align: 'center' as const },
  { title: '이메일', dataIndex: 'email', key: 'email', width: '25%' },
  { title: '상태', dataIndex: 'status', key: 'status', width: '10%', align: 'center' as const,
    render: (val: string) => <Tag color={val === '활성' ? 'green' : 'default'}>{val}</Tag>,
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

const DataDisplayGuide = () => {
  return (
    <GuideSection id="data-display" title="데이터 표시 (Data Display)" description="그리드, 트리, 카드, 태그 등 데이터 표시 컴포넌트">
      {/* DataGrid / DataTable */}
      <GuideDemoBox title="DataGrid / DataTable (CustomTable)">
        <CustomTable
          rowKey="id"
          columns={tableColumns}
          dataSource={tableData}
          rowNoFlag
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }}
        />
      </GuideDemoBox>

      {/* TreeGrid */}
      <GuideDemoBox title="TreeGrid / Tree (트리형)">
        <Tree.DirectoryTree
          showLine
          defaultExpandAll
          treeData={treeData}
        />
      </GuideDemoBox>

      {/* Card / CardList */}
      <GuideDemoBox title="Card / CardList (카드형 목록)">
        <div className="guide-card-row">
          <Card title="사용자 현황" extra={<a href="#">더보기</a>}>
            <p>전체 사용자: 1,234명</p>
            <p>활성 사용자: 1,100명</p>
          </Card>
          <Card title="시스템 상태" extra={<Badge status="success" text="정상" />}>
            <p>CPU: 45%</p>
            <p>Memory: 62%</p>
          </Card>
          <Card title="최근 공지" hoverable>
            <p>시스템 정기 점검 안내</p>
            <p>2024-03-20 예정</p>
          </Card>
        </div>
      </GuideDemoBox>

      {/* DescriptionList */}
      <GuideDemoBox title="DescriptionList (상세 정보)">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="이름">홍길동</Descriptions.Item>
          <Descriptions.Item label="부서">개발팀</Descriptions.Item>
          <Descriptions.Item label="직급">과장</Descriptions.Item>
          <Descriptions.Item label="이메일">hong@example.com</Descriptions.Item>
          <Descriptions.Item label="전화번호">010-1234-5678</Descriptions.Item>
          <Descriptions.Item label="입사일">2020-03-15</Descriptions.Item>
          <Descriptions.Item label="비고" span={2}>
            시스템 관리자 권한 보유
          </Descriptions.Item>
        </Descriptions>
      </GuideDemoBox>

      {/* Tag / Badge */}
      <GuideDemoBox title="Tag / Badge (상태 표시)">
        <div className="guide-sub-section">
          <h5>Tag</h5>
          <div className="guide-demo-row">
            <Tag>기본</Tag>
            <Tag color="success" icon={<CheckCircleOutlined />}>완료</Tag>
            <Tag color="processing" icon={<SyncOutlined spin />}>진행중</Tag>
            <Tag color="warning" icon={<ClockCircleOutlined />}>대기</Tag>
            <Tag color="error" icon={<CloseCircleOutlined />}>오류</Tag>
            <Tag color="#FFDD00">커스텀</Tag>
          </div>
        </div>
        <div className="guide-sub-section">
          <h5>Badge</h5>
          <div className="guide-demo-row">
            <Badge count={5}><div className="guide-badge-placeholder">알림</div></Badge>
            <Badge count={99}><div className="guide-badge-placeholder">메시지</div></Badge>
            <Badge dot><div className="guide-badge-placeholder">업데이트</div></Badge>
            <Badge status="success" text="성공" />
            <Badge status="error" text="실패" />
            <Badge status="processing" text="처리중" />
          </div>
        </div>
      </GuideDemoBox>

      {/* Timeline */}
      <GuideDemoBox title="Timeline (이력/타임라인)">
        <div className="guide-timeline-wrap">
          <Timeline
            items={[
              { color: 'green', children: '시스템 배포 완료 (2024-03-20 14:00)' },
              { color: 'blue', children: '테스트 승인 (2024-03-19 10:30)' },
              { color: 'blue', children: 'QA 테스트 시작 (2024-03-18 09:00)' },
              { color: 'gray', children: '개발 완료 (2024-03-15 18:00)' },
              { color: 'gray', children: '요구사항 확정 (2024-03-10 11:00)' },
            ]}
          />
        </div>
      </GuideDemoBox>

      {/* Statistic */}
      <GuideDemoBox title="Statistic (숫자 통계 카드)">
        <div className="guide-stat-row">
          <div>
            <Statistic title="전체 사용자" value={1234} />
          </div>
          <div>
            <Statistic title="금일 접속자" value={89} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#3f8600' }} />
          </div>
          <div>
            <Statistic title="오류 건수" value={3} prefix={<ArrowDownOutlined />} valueStyle={{ color: '#cf1322' }} />
          </div>
          <div>
            <Statistic title="처리율" value={93.5} suffix="%" precision={1} />
          </div>
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default DataDisplayGuide;
