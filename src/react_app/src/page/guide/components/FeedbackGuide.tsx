import React, { useState } from 'react';
import { Drawer, notification, Alert, Skeleton, Progress, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CustomButton from '@component/CustomButton';
import CustomModal from '@component/CustomModal';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const { confirm } = CustomModal;

const FeedbackGuide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
        <Drawer
          title="상세 정보"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={400}
        >
          <p>Drawer 내용입니다. 우측에서 슬라이드되는 패널입니다.</p>
          <p>상세 정보나 설정 등을 표시할 때 사용합니다.</p>
        </Drawer>
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
          <Alert message="정보 메시지입니다." type="info" showIcon />
          <Alert message="성공 메시지입니다." type="success" showIcon />
          <Alert message="경고 메시지입니다." type="warning" showIcon />
          <Alert message="오류 메시지입니다." type="error" showIcon />
          <Alert
            message="닫기 가능한 알림"
            description="이 알림은 사용자가 닫을 수 있습니다."
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
              <Skeleton active />
            </div>
          </GuideStatusItem>
          <GuideStatusItem label="Skeleton (아바타)">
            <div className="guide-skeleton-box">
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* ProgressBar */}
      <GuideDemoBox title="ProgressBar (진행률 표시)">
        <div className="guide-progress-box">
          <Progress percent={30} />
          <Progress percent={70} status="active" />
          <Progress percent={100} />
          <Progress percent={50} status="exception" />
          <Progress type="circle" percent={75} size={80} />
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default FeedbackGuide;
