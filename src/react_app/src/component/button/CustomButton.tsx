/**
 * CustomButton - Ant Design Button 래퍼 컴포넌트
 *
 * [목적]
 * Ant Design Button을 프로젝트 공통 컴포넌트로 래핑한다.
 * 향후 전역 스타일 변경, 공통 속성 추가 시 이 파일만 수정하면 된다.
 *
 * [사용 방법]
 * @example
 * // 기본 버튼
 * <CustomButton onClick={handleClick}>확인</CustomButton>
 *
 * // 타입 지정
 * <CustomButton type="primary" onClick={handleSave}>저장</CustomButton>
 * <CustomButton type="default" danger onClick={handleDelete}>삭제</CustomButton>
 *
 * // 아이콘 포함
 * <CustomButton type="primary" icon={<DownloadOutlined />}>다운로드</CustomButton>
 *
 * // 로딩 상태
 * <CustomButton type="primary" loading={isSaving}>저장 중</CustomButton>
 *
 * // 비활성화
 * <CustomButton disabled>비활성</CustomButton>
 */
import React from 'react';
import {Button, ButtonProps} from 'antd';

interface CustomButtonProps  extends ButtonProps {
    [key: string]: any;
};

const CustomButton  = (props:CustomButtonProps) => {
    return (
        <Button {...props} />
    );
};

export default CustomButton;