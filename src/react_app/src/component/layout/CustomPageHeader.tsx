/**
 * CustomPageHeader - 페이지 헤더 컴포넌트
 *
 * [목적]
 * 관리자 화면 상단에 페이지 제목, 뒤로가기 버튼, 부가 액션 버튼 영역을 일관되게 제공한다.
 * antd v5에서 PageHeader가 제거됨에 따라 Flex + Typography 기반으로 구현한 프로젝트 전용 컴포넌트다.
 *
 * @param title    - 페이지 제목 (필수)
 * @param onBack   - 뒤로가기 버튼 클릭 핸들러. 전달 시 좌측에 ArrowLeftOutlined 버튼 표시
 * @param extra    - 우측 부가 액션 영역 (버튼, 태그 등 ReactNode)
 * @param subTitle - 제목 우측에 표시할 보조 텍스트
 *
 * [사용 방법]
 * @example
 * import CustomPageHeader from '@component/layout/CustomPageHeader';
 *
 * // 기본 제목만
 * <CustomPageHeader title="사용자 관리" />
 *
 * // 뒤로가기 + 부가 액션
 * <CustomPageHeader
 *   title="사용자 상세"
 *   onBack={() => router.back()}
 *   extra={
 *     <CustomSpace>
 *       <CustomButton onClick={handleEdit}>수정</CustomButton>
 *       <CustomButton danger onClick={handleDelete}>삭제</CustomButton>
 *     </CustomSpace>
 *   }
 * />
 *
 * // 보조 제목
 * <CustomPageHeader
 *   title="공지사항"
 *   subTitle="전체 12건"
 *   extra={<CustomButton type="primary" onClick={handleCreate}>등록</CustomButton>}
 * />
 */
import React from 'react';
import {Flex, Typography} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import CustomButton from '@component/button/CustomButton';

interface CustomPageHeaderProps {
    title: string;
    subTitle?: React.ReactNode;
    onBack?: () => void;
    extra?: React.ReactNode;
}

const CustomPageHeader = ({title, subTitle, onBack, extra}: CustomPageHeaderProps) => {
    return (
        <Flex justify="space-between" align="center" className="page-header">
            <Flex align="center" gap={8}>
                {onBack && (
                    <CustomButton
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                    />
                )}
                <Typography.Title level={4} style={{margin: 0}}>
                    {title}
                </Typography.Title>
                {subTitle && (
                    <Typography.Text type="secondary">{subTitle}</Typography.Text>
                )}
            </Flex>
            {extra && <div>{extra}</div>}
        </Flex>
    );
};

export default CustomPageHeader;
