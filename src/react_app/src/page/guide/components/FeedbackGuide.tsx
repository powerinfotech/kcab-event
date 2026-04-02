import React, { useState } from 'react';
import { message, Modal, notification} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CustomButton from '@component/button/CustomButton';
import CustomModal from '@component/feedback/CustomModal';
import CustomDrawer from '@component/feedback/CustomDrawer';
import CustomAlert from '@component/feedback/CustomAlert';
import CustomSkeleton from '@component/feedback/CustomSkeleton';
import CustomProgress from '@component/feedback/CustomProgress';
import CustomPopconfirm from '@component/feedback/CustomPopconfirm';
import CustomResult from '@component/feedback/CustomResult';
import CustomSpin from '@component/feedback/CustomSpin';
import CustomTable from '@component/display/CustomTable';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const { confirm } = Modal;

const spinTableColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: '20%', align: 'center' as const },
  { title: '이름', dataIndex: 'name', key: 'name' },
  { title: '부서', dataIndex: 'dept', key: 'dept' },
];
const spinTableData = [
  { id: 1, name: '홍길동', dept: '개발팀' },
  { id: 2, name: '김철수', dept: '인사팀' },
];

const FeedbackGuide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error' | 'warning' | '404' | '403' | '500' | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const showConfirm = () => {
    confirm({
      title: '삭제 확인',
      icon: <ExclamationCircleOutlined />,
      content: '선택한 항목을 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      onOk() {
        messageApi.success('삭제되었습니다.');
      },
    });
  };

  return (
    <GuideSection id="feedback" title="피드백 / 알림 (Feedback)" description="모달, 알림, 로딩 등 사용자 피드백 컴포넌트">
      {contextHolder}

      {/* Modal */}
      <GuideDemoBox title="Modal / Dialog (모달 팝업)">
        <div className="guide-feedback-row">
          <CustomButton onClick={() => setModalOpen(true)}>모달 열기</CustomButton>
          <CustomButton onClick={showConfirm}>확인 다이얼로그</CustomButton>
        </div>
        <CustomModal
          title="모달 제목"
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        >
          <p>모달 내용입니다. CustomModal은 antd Modal을 래핑하여 한국어 기본값을 제공합니다.</p>
        </CustomModal>
      </GuideDemoBox>

      {/* Drawer */}
      <GuideDemoBox title="Drawer (슬라이드 패널)">
        <div className="guide-feedback-row">
          <CustomButton onClick={() => setDrawerOpen(true)}>Drawer 열기</CustomButton>
        </div>
        <CustomDrawer
          title="상세 정보"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          size="default"
        >
          <p>Drawer 내용입니다. 우측에서 슬라이드되는 패널입니다.</p>
          <p>상세 정보나 설정 등을 표시할 때 사용합니다.</p>
        </CustomDrawer>
      </GuideDemoBox>

      {/* Toast / Notification */}
      <GuideDemoBox title="Toast / Notification (알림 메시지)">
        <div className="guide-sub-section">
          <h5>Message (간단 알림)</h5>
          <div className="guide-feedback-row">
            <CustomButton onClick={() => messageApi.success('저장 되었습니다.')}>성공</CustomButton>
            <CustomButton onClick={() => messageApi.info('조회 완료')}>정보</CustomButton>
            <CustomButton onClick={() => messageApi.warning('입력값을 확인하세요.')}>경고</CustomButton>
            <CustomButton onClick={() => messageApi.error('오류가 발생하였습니다.')}>오류</CustomButton>
          </div>
        </div>
        <div className="guide-sub-section">
          <h5>Notification (상세 알림)</h5>
          <div className="guide-feedback-row">
            <CustomButton
              onClick={() =>
                notification.success({
                  message: '처리 완료',
                  description: '요청하신 작업이 성공적으로 완료되었습니다.',
                })
              }
            >
              성공 알림
            </CustomButton>
            <CustomButton
              onClick={() =>
                notification.error({
                  message: '오류 발생',
                  description: '서버와의 통신 중 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.',
                })
              }
            >
              오류 알림
            </CustomButton>
          </div>
        </div>
      </GuideDemoBox>

      {/* Alert */}
      <GuideDemoBox title="Alert (인라인 경고/안내)">
        <div className="guide-demo-content">
          <CustomAlert title="정보 메시지입니다." type="info" showIcon />
          <CustomAlert title="성공 메시지입니다." type="success" showIcon />
          <CustomAlert title="경고 메시지입니다." type="warning" showIcon />
          <CustomAlert title="오류 메시지입니다." type="error" showIcon />
          <CustomAlert
            title="닫기 가능한 알림"
            content="이 알림은 사용자가 닫을 수 있습니다."
            type="info"
            showIcon
            closable
          />
        </div>
      </GuideDemoBox>

      {/* Loading / Skeleton */}
      <GuideDemoBox title="Loading / Skeleton (로딩 표시)">
        <GuideStatusRow>
          <GuideStatusItem label="Skeleton">
            <div className="guide-skeleton-box">
              <CustomSkeleton active />
            </div>
          </GuideStatusItem>
          <GuideStatusItem label="Skeleton (아바타)">
            <div className="guide-skeleton-box">
              <CustomSkeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* ProgressBar */}
      <GuideDemoBox title="ProgressBar (진행률 표시)">
        <div className="guide-progress-box">
          <CustomProgress percent={30} />
          <CustomProgress percent={70} status="active" />
          <CustomProgress percent={100} />
          <CustomProgress percent={50} status="exception" />
          <CustomProgress type="circle" percent={75} size={80} />
        </div>
      </GuideDemoBox>

      {/* Popconfirm */}
      <GuideDemoBox title="Popconfirm (인라인 확인 팝업)">
        <div className="guide-feedback-row">
          <CustomPopconfirm
            title="삭제 확인"
            description="선택한 항목을 삭제하시겠습니까?"
            onConfirm={() => messageApi.success('삭제되었습니다.')}
          >
            <CustomButton danger>삭제</CustomButton>
          </CustomPopconfirm>
          <CustomPopconfirm
            title="초기화"
            description="입력한 내용이 모두 초기화됩니다."
            okText="초기화"
            cancelText="돌아가기"
            onConfirm={() => messageApi.info('초기화되었습니다.')}
          >
            <CustomButton>초기화</CustomButton>
          </CustomPopconfirm>
          <CustomPopconfirm
            title="진행하시겠습니까?"
            icon={null}
            onConfirm={() => messageApi.success('진행합니다.')}
          >
            <CustomButton type="primary">아이콘 없이</CustomButton>
          </CustomPopconfirm>
        </div>
        <div className="guide-demo-description">
          Modal.confirm과 달리 요소 옆에 말풍선으로 표시. 삭제·초기화 등 가벼운 확인 동작에 사용
        </div>
      </GuideDemoBox>

      {/* Spin */}
      <GuideDemoBox title="Spin (영역 로딩 스피너)">
        <GuideStatusRow>
          <GuideStatusItem label="영역 감싸기">
            <div>
              <CustomButton
                style={{ marginBottom: 12 }}
                onClick={() => {
                  setIsSpinning(true);
                  setTimeout(() => setIsSpinning(false), 2000);
                }}
              >
                로딩 시작 (2초)
              </CustomButton>
              <CustomSpin spinning={isSpinning} description="데이터를 불러오는 중...">
                <CustomTable
                  rowKey="id"
                  columns={spinTableColumns}
                  dataSource={spinTableData}
                  pagination={false}
                />
              </CustomSpin>
            </div>
          </GuideStatusItem>
          <GuideStatusItem label="단독 스피너">
            <CustomSpin />
          </GuideStatusItem>
          <GuideStatusItem label="small">
            <CustomSpin size="small" />
          </GuideStatusItem>
          <GuideStatusItem label="large">
            <CustomSpin size="large" />
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          특정 영역만 로딩 처리. 전역 로딩은 CustomLoading(layout) 사용
        </div>
      </GuideDemoBox>

      {/* Result */}
      <GuideDemoBox title="Result (결과 상태 표시)">
        <div className="guide-feedback-row" style={{ marginBottom: 16 }}>
          <CustomButton type="primary" onClick={() => setResultStatus('success')}>성공</CustomButton>
          <CustomButton onClick={() => setResultStatus('warning')}>경고</CustomButton>
          <CustomButton danger onClick={() => setResultStatus('error')}>오류</CustomButton>
          <CustomButton onClick={() => setResultStatus('404')}>404</CustomButton>
          <CustomButton onClick={() => setResultStatus('403')}>403</CustomButton>
          <CustomButton onClick={() => setResultStatus('500')}>500</CustomButton>
        </div>
        {resultStatus === 'success' && (
          <CustomResult
            status="success"
            title="등록이 완료되었습니다."
            subTitle="사용자 정보가 성공적으로 저장되었습니다."
            extra={<CustomButton onClick={() => setResultStatus(null)}>닫기</CustomButton>}
          />
        )}
        {resultStatus === 'warning' && (
          <CustomResult
            status="warning"
            title="처리 중 일부 항목에서 문제가 발생했습니다."
            subTitle="확인 후 다시 시도해주세요."
            extra={<CustomButton onClick={() => setResultStatus(null)}>닫기</CustomButton>}
          />
        )}
        {resultStatus === 'error' && (
          <CustomResult
            status="error"
            title="처리에 실패하였습니다."
            subTitle="잠시 후 다시 시도해주세요."
            extra={<CustomButton onClick={() => setResultStatus(null)}>닫기</CustomButton>}
          />
        )}
        {resultStatus === '404' && (
          <CustomResult
            status="404"
            title="페이지를 찾을 수 없습니다."
            extra={<CustomButton onClick={() => setResultStatus(null)}>닫기</CustomButton>}
          />
        )}
        {resultStatus === '403' && (
          <CustomResult
            status="403"
            title="접근 권한이 없습니다."
            subTitle="관리자에게 문의하세요."
            extra={<CustomButton onClick={() => setResultStatus(null)}>닫기</CustomButton>}
          />
        )}
        {resultStatus === '500' && (
          <CustomResult
            status="500"
            title="서버 오류가 발생하였습니다."
            subTitle="잠시 후 다시 시도해주세요."
            extra={<CustomButton onClick={() => setResultStatus(null)}>닫기</CustomButton>}
          />
        )}
        <div className="guide-demo-description">
          작업 완료·오류·권한 없음 등 결과 상태를 페이지 또는 영역에 표시. status: success / warning / error / 404 / 403 / 500
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default FeedbackGuide;
