/**
 * CustomPopconfirm - 인라인 확인 팝업 컴포넌트
 *
 * [목적]
 * 버튼 클릭 시 바로 실행하지 않고, 작은 확인 팝업을 표시하여 사용자 의도를 재확인할 때 사용한다.
 * 삭제, 초기화 등 되돌리기 어려운 동작에 적합하다.
 * 한국어 기본값(okText='확인', cancelText='취소')을 적용한다.
 *
 * [CustomModal confirm과의 차이]
 * - CustomPopconfirm: 요소 옆에 작은 말풍선으로 표시 (인라인, 가벼운 확인)
 * - Modal.confirm / useMessage().confirm: 화면 중앙 다이얼로그 (무거운 확인)
 *
 * [사용 방법]
 * @example
 * import CustomPopconfirm from '@component/feedback/CustomPopconfirm';
 *
 * // 삭제 확인
 * <CustomPopconfirm
 *   title="삭제 확인"
 *   description="선택한 항목을 삭제하시겠습니까?"
 *   onConfirm={() => handleDelete(record.id)}
 * >
 *   <CustomButton danger>삭제</CustomButton>
 * </CustomPopconfirm>
 *
 * // 초기화 확인
 * <CustomPopconfirm
 *   title="초기화"
 *   description="입력한 내용이 모두 사라집니다."
 *   onConfirm={handleReset}
 *   okText="초기화"
 *   cancelText="돌아가기"
 * >
 *   <CustomButton>초기화</CustomButton>
 * </CustomPopconfirm>
 *
 * // 아이콘 없이
 * <CustomPopconfirm
 *   title="진행하시겠습니까?"
 *   onConfirm={handleProceed}
 *   icon={null}
 * >
 *   <a href="#">진행</a>
 * </CustomPopconfirm>
 */
import React from 'react';
import {Popconfirm, PopconfirmProps} from 'antd';

interface CustomPopconfirmProps extends PopconfirmProps {}

const CustomPopconfirm = (props: CustomPopconfirmProps) => {
    return (
        <Popconfirm
            okText={props.okText ?? '확인'}
            cancelText={props.cancelText ?? '취소'}
            {...props}
        />
    );
};

export default CustomPopconfirm;
