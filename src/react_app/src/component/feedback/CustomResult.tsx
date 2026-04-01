/**
 * CustomResult - Ant Design Result 래퍼 컴포넌트
 *
 * [목적]
 * 작업 완료, 에러 발생, 권한 없음 등 결과 상태를 전체 페이지 또는 영역에 표시할 때 사용한다.
 * 아이콘 + 제목 + 설명 + 추가 액션 버튼 구성을 제공한다.
 *
 * [사용 방법]
 * @example
 * import CustomResult from '@component/feedback/CustomResult';
 *
 * // 작업 성공
 * <CustomResult
 *   status="success"
 *   title="등록이 완료되었습니다."
 *   subTitle="사용자 정보가 성공적으로 저장되었습니다."
 *   extra={<CustomButton type="primary" onClick={() => navigate('/list')}>목록으로</CustomButton>}
 * />
 *
 * // 서버 오류
 * <CustomResult
 *   status="500"
 *   title="서버 오류"
 *   subTitle="잠시 후 다시 시도해주세요."
 * />
 *
 * // 권한 없음
 * <CustomResult
 *   status="403"
 *   title="접근 권한이 없습니다."
 *   subTitle="관리자에게 문의하세요."
 *   extra={<CustomButton onClick={() => navigate('/')}>홈으로</CustomButton>}
 * />
 *
 * // 페이지 없음
 * <CustomResult
 *   status="404"
 *   title="페이지를 찾을 수 없습니다."
 *   extra={<CustomButton onClick={() => navigate(-1)}>이전 페이지</CustomButton>}
 * />
 *
 * // 경고
 * <CustomResult
 *   status="warning"
 *   title="처리 중 일부 항목에서 문제가 발생했습니다."
 * />
 */
import React from 'react';
import {Result, ResultProps} from 'antd';

interface CustomResultProps extends ResultProps {}

const CustomResult = (props: CustomResultProps) => {
    return (
        <Result {...props} />
    );
};

export default CustomResult;
