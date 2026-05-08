'use client';

import React from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  MoreOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  SendOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import { getAdminRole } from '@util/fixedAdminMenus';

type Metric = {
  label: string;
  value: string;
  help?: string;
  tone?: 'yellow' | 'blue' | 'green' | 'red';
};

type TableColumn = {
  key: string;
  label: string;
};

type TableRow = Record<string, React.ReactNode>;

const superMetrics: Metric[] = [
  { label: '승인 대기', value: '3건', help: '부대행사 처리 필요', tone: 'yellow' },
  { label: '등록된 행사', value: '8개', help: '오피셜 3 · 부대 5', tone: 'blue' },
  { label: '전체 참가자', value: '1,247명', help: '최근 7일 +213명', tone: 'green' },
];

const orgMetrics: Metric[] = [
  { label: '내 행사', value: '2개', tone: 'blue' },
  { label: '승인 대기', value: '1건', tone: 'yellow' },
  { label: '총 신청자', value: '32명', tone: 'green' },
];

const eventRows: TableRow[] = [
  { name: '서울 국제중재 컨퍼런스', date: '09.10', type: <Status tone="blue">오피셜</Status>, host: 'KCAB', count: '215/300', status: <Status tone="green">게시중</Status>, action: '수정 · 삭제' },
  { name: 'ADR 네트워킹 리셉션', date: '09.11', type: <Status tone="blue">오피셜</Status>, host: 'KCAB', count: '412/500', status: <Status tone="green">게시중</Status>, action: '수정 · 삭제' },
  { name: '폐막식 & 갈라', date: '09.14', type: <Status tone="blue">오피셜</Status>, host: 'KCAB', count: '180/300', status: <Status tone="green">게시중</Status>, action: '수정 · 삭제' },
  { name: 'ABC 로펌 세미나', date: '09.12', type: <Status tone="orange">부대행사</Status>, host: 'ABC 로펌', count: '0/80', status: <Status tone="yellow">승인대기</Status>, action: '수정 · 삭제' },
  { name: 'XYZ 라운드테이블', date: '09.13', type: <Status tone="orange">부대행사</Status>, host: 'XYZ 로펌', count: '32/60', status: <Status tone="green">게시중</Status>, action: '수정 · 삭제' },
  { name: 'DEF 리셉션', date: '09.11', type: <Status tone="orange">부대행사</Status>, host: 'DEF 로펌', count: '0/100', status: <Status>초안</Status>, action: '수정 · 삭제' },
];

const participantRows: TableRow[] = [
  { check: '☐', name: '홍길동', email: 'hong@kcab.or.kr', org: 'KCAB', event: '컨퍼런스', payment: '₩ 275,000', action: <MoreOutlined /> },
  { check: '☐', name: '김민수', email: 'minsoo@law.com', org: '법무법인 이앤코', event: '컨퍼런스', payment: '₩ 200,000', action: <MoreOutlined /> },
  { check: '☐', name: '이영희', email: 'yhlee@xyz.law', org: 'XYZ 로펌', event: '부대행사: XYZ', payment: '무료', action: <MoreOutlined /> },
  { check: '☐', name: 'John Smith', email: 'john@global.com', org: 'Global Inc.', event: '컨퍼런스', payment: '$ 200', action: <MoreOutlined /> },
  { check: '☐', name: '박은주', email: 'park@aaa.com', org: 'AAA 그룹', event: '리셉션', payment: '무료', action: <MoreOutlined /> },
  { check: '☐', name: '야마다 타로', email: 'yamada@jp.com', org: 'JP Arbitration', event: '컨퍼런스', payment: '¥ 25,000', action: <MoreOutlined /> },
  { check: '☐', name: '천웨이', email: 'chen@cn.law', org: 'CN Lawyers', event: '리셉션', payment: '무료', action: <MoreOutlined /> },
];

const orgParticipantRows: TableRow[] = [
  { check: '☐', name: '김민수', email: 'kim@abc.law', org: '법무법인 한울', event: 'ABC 칵테일 리셉션', payment: '04.25', action: <MoreOutlined /> },
  { check: '☐', name: '이영희', email: 'yhlee@xx.com', org: 'XYZ 그룹', event: 'ABC 칵테일 리셉션', payment: '04.24', action: <MoreOutlined /> },
  { check: '☐', name: '박철수', email: 'park@aaa.com', org: '한국상사중재원', event: 'ABC 칵테일 리셉션', payment: '04.24', action: <MoreOutlined /> },
  { check: '☐', name: 'John Smith', email: 'john@global.com', org: 'Global Corp', event: 'ABC 칵테일 리셉션', payment: '04.23', action: <MoreOutlined /> },
  { check: '☐', name: '정수진', email: 'jung@dev.com', org: '한국연구원', event: 'Cross-Border 세미나', payment: '04.22', action: <MoreOutlined /> },
  { check: '☐', name: '야마다', email: 'yamada@jp.com', org: 'JP Arbitration', event: 'Cross-Border 세미나', payment: '04.20', action: <MoreOutlined /> },
];

const paymentRows: TableRow[] = [
  { id: 'TX-9F4A21', date: '04.28', payer: '홍길동', event: '컨퍼런스', method: '카드', amount: '₩ 275,000', status: <Status tone="green">결제완료</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A20', date: '04.28', payer: '이영희', event: '컨퍼런스', method: '카드', amount: '₩ 200,000', status: <Status tone="green">결제완료</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A19', date: '04.27', payer: 'John Smith', event: '컨퍼런스', method: 'PayPal', amount: '$ 200', status: <Status tone="green">결제완료</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A18', date: '04.27', payer: '박은주', event: '리셉션', method: '무료', amount: '-', status: <Status>무료</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A17', date: '04.26', payer: '야마다', event: '컨퍼런스', method: 'Eximbay', amount: '¥ 25,000', status: <Status tone="red">환불</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A16', date: '04.26', payer: '천웨이', event: '컨퍼런스', method: '카드', amount: '₩ 200,000', status: <Status tone="red">실패</Status>, action: <MoreOutlined /> },
];

function useMove() {
  const setCurrentPath = useSetAtom(currentPathAtom);
  return (url: string) => pushPath(url, setCurrentPath);
}

function useRole() {
  const sessionInfo = useAtomValue(sessionInfoAtom);
  return getAdminRole(sessionInfo.admYn);
}

function ScreenHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="saf-screen-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="saf-screen-actions">{actions}</div>}
    </header>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  variant = 'secondary',
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button type="button" className={`saf-action-btn is-${variant}`} onClick={onClick}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

function Status({ children, tone = 'gray' }: { children: React.ReactNode; tone?: 'gray' | 'green' | 'yellow' | 'blue' | 'orange' | 'red' }) {
  return <span className={`saf-status is-${tone}`}>{children}</span>;
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="saf-metric-grid">
      {metrics.map((metric) => (
        <article className={`saf-metric-card is-${metric.tone ?? 'gray'}`} key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          {metric.help && <p>{metric.help}</p>}
        </article>
      ))}
    </section>
  );
}

function DataTable({ columns, rows, footer }: { columns: TableColumn[]; rows: TableRow[]; footer?: string }) {
  return (
    <section className="saf-table-wrap">
      <table className="saf-table">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{column.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((column) => <td key={column.key}>{row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {footer && <div className="saf-table-footer">{footer}</div>}
    </section>
  );
}

function SearchFilters({ orgOnly = false, variant = 'events' }: { orgOnly?: boolean; variant?: 'events' | 'participants' }) {
  const isParticipants = variant === 'participants';
  return (
    <section className="saf-filter-row">
      <div className="saf-search">
        <SearchOutlined />
        <input placeholder={isParticipants ? '이름 / 이메일 / 소속으로 검색...' : '행사명 / 주최기관으로 검색...'} />
      </div>
      <button type="button">{isParticipants ? (orgOnly ? '내 행사 전체 (2)' : '전체 행사') : '전체 상태'}</button>
      <button type="button">{isParticipants ? (orgOnly ? '결제' : '결제완료') : '전체 유형'}</button>
    </section>
  );
}

export function SuperDashboard() {
  const move = useMove();
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="환영합니다, 관리자님"
      />
      <MetricGrid metrics={superMetrics} />
      <div className="saf-dashboard-grid">
        <section className="saf-panel is-wide">
          <PanelTitle title="처리해야 할 부대행사 (3건)" />
          {[
            ['#SE-0042', '2일 전 신청', 'Cross-Border 국제중재 동향 세미나', 'ABC 로펌 · 09.12 · 롯데호텔 · 정원 80명', '#국제중재 #세미나'],
            ['#SE-0043', '1일 전 신청', '신흥시장 분쟁해결 라운드테이블', 'XYZ 로펌 · 09.13 · 신라호텔 · 정원 60명', '#국제중재'],
            ['#SE-0044', '5시간 전 신청', '건설 분쟁 해결 워크숍', 'DEF 로펌 · 09.11 · DEF 사옥 · 정원 100명', '#건설중재 #네트워킹'],
          ].map(([id, time, title, meta, tags]) => (
            <article className="saf-review-card" key={id}>
              <div>
                <span>{id}</span>
                <em>{time}</em>
              </div>
              <strong>{title}</strong>
              <p>{meta}</p>
              <small>{tags}</small>
              <button type="button" onClick={() => move('/admin/side-events/SE-0042')}>검토 →</button>
            </article>
          ))}
        </section>
        <section className="saf-panel">
          <PanelTitle title="다가오는 행사 (D-day)" />
          <ol className="saf-date-list">
            {['09.10 서울 국제중재 컨퍼런스 · 오피셜', '09.11 ADR 네트워킹 리셉션 · 오피셜', '09.12 ABC 세미나 · 부대 (대기)', '09.14 폐막식 & 갈라 · 오피셜'].map((item) => (
              <li key={item}><CalendarOutlined /> {item}</li>
            ))}
          </ol>
        </section>
        <section className="saf-panel">
          <PanelTitle title="최근 활동" />
          <ol className="saf-activity-list">
            <li><strong>ABC 로펌이 부대행사 신청</strong><span>10분 전</span></li>
            <li><strong>XYZ 로펌 회원가입 승인 대기</strong><span>2시간 전</span></li>
            <li><strong>오피셜 행사 'ADR 리셉션' 수정</strong><span>어제</span></li>
          </ol>
        </section>
      </div>
    </div>
  );
}

export function OrgDashboard() {
  const move = useMove();
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="ABC 로펌, 환영합니다"
        actions={<ActionButton icon={<PlusOutlined />} variant="primary" onClick={() => move('/admin/side-events/new')}>부대행사 신청</ActionButton>}
      />
      <MetricGrid metrics={orgMetrics} />
      <section className="saf-card-list">
        <OrgEventCard title="Cross-Border 국제중재 동향 세미나" meta="09.12 · 롯데호텔 · 정원 80명" status={<Status tone="yellow">승인 대기</Status>} />
        <OrgEventCard title="ABC 칵테일 리셉션" meta="09.13 · ABC 사옥 · 정원 50명" status={<Status tone="green">게시중</Status>} caption="참가자: 32/50" />
      </section>
    </div>
  );
}

export function DashboardByRole() {
  return useRole() === 'ADMIN' ? <SuperDashboard /> : <OrgDashboard />;
}

export function SuperEventList() {
  const move = useMove();
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="행사 관리"
        actions={<ActionButton icon={<PlusOutlined />} variant="primary" onClick={() => move('/admin/events/new')}>새 행사</ActionButton>}
      />
      <SearchFilters />
      <DataTable
        columns={[
          { key: 'name', label: '행사명' },
          { key: 'date', label: '일자' },
          { key: 'type', label: '유형' },
          { key: 'host', label: '주최' },
          { key: 'count', label: '신청' },
          { key: 'status', label: '상태' },
          { key: 'action', label: '관리' },
        ]}
        rows={eventRows}
        footer="1-6 / 18건 · ‹ 1 2 3 ›"
      />
    </div>
  );
}

export function EventEditor() {
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="새 행사 등록"
        actions={<><ActionButton icon={<SaveOutlined />}>임시저장</ActionButton><ActionButton variant="primary" icon={<SendOutlined />}>게시하기</ActionButton></>}
      />
      <div className="saf-editor-layout">
        <section className="saf-panel">
          <nav className="saf-editor-tabs">
            {['기본 정보', '본문 설명', '일정', '참가비', '정원', 'SEO'].map((tab, idx) => (
              <button className={idx === 0 ? 'is-active' : ''} type="button" key={tab}>{tab}</button>
            ))}
          </nav>
          <div className="saf-lang-tabs">
            <button className="is-active" type="button">한국어</button>
            <button type="button">English</button>
          </div>
          <FormGrid>
            <Field label="행사명 *"><input defaultValue="서울 국제중재 컨퍼런스 2026" /></Field>
            <Field label="부제 (선택)"><input defaultValue="Korean Commercial Arbitration Board" /></Field>
            <Field label="본문 설명 *" wide><textarea defaultValue="행사 개요·주제·참가 대상... (다음 탭에서 WYSIWYG 편집)" /></Field>
          </FormGrid>
          <p className="saf-hint">English 탭에서도 영문 정보를 입력하세요. 미입력 시 영문 사이트에 한국어로 표시됩니다.</p>
        </section>
        <section className="saf-panel">
          <PanelTitle title="공통 정보" subtitle="언어 무관, 한 번만 입력" />
          <FormGrid>
            <Field label="행사 유형 *"><select defaultValue="official"><option value="official">오피셜</option><option>부대행사</option></select></Field>
            <Field label="주최 *"><input defaultValue="KCAB 국제중재" /></Field>
            <Field label="일자 *"><input defaultValue="2026-09-10" /></Field>
            <Field label="장소 *"><input defaultValue="콘래드 서울" /></Field>
            <UploadBox />
            <Field label="공개 범위"><select><option>전체 공개</option><option>회원 전용</option><option>초대형</option></select></Field>
            <Field label="태그" wide><input defaultValue="# 컨퍼런스  # ADR  # 한·영" /></Field>
          </FormGrid>
          <p className="saf-warning">게시 후 외부에 노출됩니다.</p>
        </section>
      </div>
    </div>
  );
}

export function SideEventReview() {
  return (
    <div className="saf-screen">
      <ScreenHeader title="부대행사 검토" subtitle="#SE-0042 · 신청자 ABC 로펌 · 2026.04.22" />
      <div className="saf-editor-layout">
        <section className="saf-panel">
          <PanelTitle title="신청 내용" />
          <DetailList items={[
            ['행사명', 'Cross-Border 국제중재 동향 세미나'],
            ['주최', 'ABC 로펌 · 담당: kim@abc.law'],
            ['일시', '2026.09.12 · 14:00 - 17:00'],
            ['장소', '롯데호텔 서울, 크리스탈볼룸'],
            ['정원', '80명 (무료)'],
            ['언어', '한·영 동시통역'],
            ['설명', 'Cross-border 분쟁 동향과 대응 전략 / 발제 3인 + 패널 토론 + 네트워킹'],
            ['첨부파일', 'agenda.pdf · speakers.pdf · venue-map.png'],
          ]} />
        </section>
        <section className="saf-panel">
          <PanelTitle title="승인 결정" />
          <Field label="신청자에게 코멘트"><textarea placeholder="코멘트를 남기면 신청자에게 메일로 함께 전달됩니다." /></Field>
          <label className="saf-check-line"><input type="checkbox" defaultChecked /> 승인 시 자동 게시</label>
          <label className="saf-check-line"><input type="checkbox" defaultChecked /> 이메일로 신청자 알림</label>
          <div className="saf-decision-actions">
            <button type="button" className="is-approve">승인</button>
            <button type="button" className="is-reject">반려</button>
            <button type="button">수정 요청</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export function Participants() {
  const role = useRole();
  const orgOnly = role !== 'ADMIN';
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="참가자 관리"
        subtitle={orgOnly ? '내 부대행사에 신청한 참가자 목록입니다.' : undefined}
        actions={<><ActionButton icon={<DownloadOutlined />}>CSV 내보내기</ActionButton><ActionButton icon={<MailOutlined />}>메일 발송</ActionButton></>}
      />
      <SearchFilters orgOnly={orgOnly} variant="participants" />
      {orgOnly && <p className="saf-summary-line">총 32명 참가 · 결제완료 0명 · 무료 32명</p>}
      <DataTable
        columns={[
          { key: 'check', label: '☐' },
          { key: 'name', label: '이름' },
          { key: 'email', label: '이메일' },
          { key: 'org', label: '소속' },
          { key: 'event', label: '행사명' },
          { key: 'payment', label: orgOnly ? '신청일' : '결제' },
          { key: 'action', label: '···' },
        ]}
        rows={orgOnly ? orgParticipantRows : participantRows}
        footer={orgOnly ? '1-6 / 32명 · ‹ 1 2 3 4 5 6 ›' : '1-7 / 1,247명 · ‹ 1 2 3 ... 178 ›'}
      />
    </div>
  );
}

export function Payments() {
  return (
    <div className="saf-screen">
      <ScreenHeader title="결제 관리" />
      <MetricGrid metrics={[
        { label: '총 매출', value: '₩ 1.45억', tone: 'green' },
        { label: '이번 주', value: '₩ 825만', tone: 'blue' },
        { label: '환불', value: '₩ 142만', tone: 'yellow' },
        { label: '실패', value: '12건', tone: 'red' },
      ]} />
      <DataTable
        columns={[
          { key: 'id', label: '거래번호' },
          { key: 'date', label: '일자' },
          { key: 'payer', label: '결제자' },
          { key: 'event', label: '행사' },
          { key: 'method', label: '수단' },
          { key: 'amount', label: '금액' },
          { key: 'status', label: '상태' },
          { key: 'action', label: '···' },
        ]}
        rows={paymentRows}
      />
      <p className="saf-footnote">환불 규정에 따라 처리되며 PG사가 정산 · 해외결제 PG (Eximbay 등) 별도 수수료 · 영수증 PDF 자동 생성</p>
    </div>
  );
}

export function EmailCms() {
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="이메일 템플릿 에디터"
        actions={<><ActionButton icon={<SendOutlined />}>테스트 발송</ActionButton><ActionButton variant="primary" icon={<SaveOutlined />}>저장 및 게시</ActionButton></>}
      />
      <div className="saf-email-layout">
        <aside className="saf-template-list">
          {['신청 확인', '결제 영수증', '부대행사 승인', '부대행사 반려', '리마인더 (D-1)', '취소 안내'].map((item, idx) => (
            <button type="button" className={idx === 0 ? 'is-active' : ''} key={item}>{item}</button>
          ))}
        </aside>
        <section className="saf-panel">
          <div className="saf-editor-toolbar">B&nbsp;&nbsp; I&nbsp;&nbsp; U&nbsp;&nbsp; ⌗ &nbsp;&nbsp;🔗&nbsp;&nbsp; 📷 &nbsp;&nbsp; 변수 ▾</div>
          <Field label="제목"><input defaultValue="[SAF 2026] {{event_name}} 등록 완료" /></Field>
          <Field label="본문 (WYSIWYG 편집기)"><textarea rows={12} defaultValue={'[ 배너 이미지 ]\n\n안녕하세요 {{name}}님,\n{{event_name}} 등록이 완료되었습니다...\n\n[QR]\n▸ {{my_page_url}}\n▸ 영수증 PDF'} /></Field>
        </section>
        <aside className="saf-panel">
          <PanelTitle title="사용 가능 변수" />
          <div className="saf-token-grid">
            {['{{name}}', '{{event_name}}', '{{date}}', '{{venue}}', '{{qr_url}}', '{{receipt_url}}', '{{my_page_url}}', '{{amount}}', '{{order_id}}'].map((token) => (
              <button type="button" key={token}>{token}</button>
            ))}
          </div>
          <div className="saf-lang-tabs">
            <button className="is-active" type="button">한국어</button>
            <button type="button">English</button>
          </div>
          <p className="saf-hint">미리보기 발송으로 실제 렌더링 확인</p>
        </aside>
      </div>
    </div>
  );
}

export function OrgSideEvents() {
  const move = useMove();
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="내 부대행사"
        actions={<ActionButton icon={<PlusOutlined />} variant="primary" onClick={() => move('/admin/side-events/new')}>부대행사 신청</ActionButton>}
      />
      <section className="saf-card-list">
        <OrgEventCard title="Cross-Border 국제중재 동향 세미나" meta="09.12 · 롯데호텔 · 정원 80명" status={<Status tone="yellow">승인 대기</Status>} />
        <OrgEventCard title="ABC 칵테일 리셉션" meta="09.13 · ABC 사옥 · 정원 50명" status={<Status tone="green">게시중</Status>} caption="참가자: 32/50" />
      </section>
    </div>
  );
}

export function OrgSideEventForm() {
  return (
    <div className="saf-screen">
      <ScreenHeader title="새 부대행사 신청" subtitle="작성 후 관리자가 검토 → 승인되면 공개 사이트에 노출됩니다." />
      <section className="saf-panel saf-form-panel">
        <FormGrid>
          <Field label="행사명 (한국어/영문) *"><input placeholder="예) Cross-Border 국제중재 세미나" /></Field>
          <Field label="일시 *"><input placeholder="2026-09-12  14:00" /></Field>
          <Field label="장소 *"><input placeholder="롯데호텔 서울" /></Field>
          <Field label="수용 인원 *"><input placeholder="80명" /></Field>
          <Field label="언어"><select><option>한·영 동시통역</option><option>한국어</option><option>English</option></select></Field>
          <Field label="행사 설명 *" wide><textarea placeholder="본 세미나는 ..." /></Field>
          <UploadBox />
          <Field label="첨부파일" wide><div className="saf-attach-list">agenda.pdf · speakers.pdf <button type="button">+ 파일 추가</button></div></Field>
        </FormGrid>
        <footer className="saf-form-footer">
          <p>신청 후 수정은 승인 전에만 가능합니다.</p>
          <ActionButton variant="primary" icon={<SendOutlined />}>검토 신청</ActionButton>
        </footer>
      </section>
    </div>
  );
}

export function OrgProfile() {
  return (
    <div className="saf-screen">
      <ScreenHeader title="프로필" subtitle="기관 정보와 가입자 정보를 관리합니다." />
      <div className="saf-editor-layout">
        <section className="saf-panel">
          <PanelTitle title="기관 정보" subtitle="organizations 테이블" />
          <FormGrid>
            <Field label="기관명 *"><input defaultValue="ABC 법무법인" /></Field>
            <Field label="사업자등록번호"><input defaultValue="123-45-67890 (변경 불가)" disabled /></Field>
            <Field label="기관 유형 *"><select><option>로펌</option></select></Field>
            <Field label="대표자명 *"><input defaultValue="김민수" /></Field>
            <Field label="대표 이메일 *"><input defaultValue="contact@abc.law" /></Field>
            <Field label="대표 전화"><input defaultValue="02-1234-5678" /></Field>
            <Field label="주소" wide><input defaultValue="서울 강남구 테헤란로 100" /></Field>
          </FormGrid>
          <ActionButton icon={<SaveOutlined />} variant="primary">기관 정보 저장</ActionButton>
        </section>
        <section className="saf-panel">
          <PanelTitle title="내 계정" subtitle="users 테이블" />
          <FormGrid>
            <Field label="이름"><input defaultValue="김민수" /></Field>
            <Field label="아이디"><input defaultValue="kim.minsoo (변경 불가)" disabled /></Field>
            <Field label="이메일"><input defaultValue="kim@abc.law" /></Field>
            <Field label="사용 언어"><select><option>한국어</option><option>English</option></select></Field>
            <Field label="현재 비밀번호"><input type="password" /></Field>
            <Field label="새 비밀번호"><input type="password" /></Field>
            <Field label="새 비밀번호 확인"><input type="password" /></Field>
          </FormGrid>
          <ActionButton icon={<SaveOutlined />} variant="primary">변경하기 + 저장</ActionButton>
        </section>
      </div>
    </div>
  );
}

export function SimpleAdminPage({ title }: { title: string }) {
  return (
    <div className="saf-screen">
      <ScreenHeader title={title} subtitle="설계서 후속 화면 정의에 맞춰 확장될 영역입니다." />
      <section className="saf-panel saf-empty-panel">
        <CheckCircleOutlined />
        <strong>{title}</strong>
        <p>고정 메뉴에는 포함되어 있으며, 상세 설계가 추가되면 같은 화면 체계로 연결합니다.</p>
      </section>
    </div>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="saf-panel-title">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function OrgEventCard({ title, meta, status, caption }: { title: string; meta: string; status: React.ReactNode; caption?: string }) {
  return (
    <article className="saf-org-event-card">
      <div className="saf-event-thumb">이미지</div>
      <div>
        <h2>{title}</h2>
        <p>{meta}</p>
        {caption && <span>{caption}</span>}
      </div>
      <footer>
        {status}
        <button type="button"><EditOutlined /> 수정</button>
        <button type="button"><EyeOutlined /> 보기</button>
      </footer>
    </article>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`saf-form-field ${wide ? 'is-wide' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="saf-form-grid">{children}</div>;
}

function UploadBox() {
  return (
    <div className="saf-upload-box">
      <UploadOutlined />
      <span>드래그 & 드롭<br />또는 파일 선택</span>
    </div>
  );
}

function DetailList({ items }: { items: [string, string][] }) {
  return (
    <dl className="saf-detail-list">
      {items.map(([label, value]) => (
        <React.Fragment key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
