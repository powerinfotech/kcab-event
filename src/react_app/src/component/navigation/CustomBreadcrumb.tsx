/**
 * CustomBreadcrumb - Ant Design Breadcrumb 래퍼 컴포넌트
 *
 * [목적]
 * 현재 페이지 경로(홈 > 사용자 관리 > 사용자 목록)를 표시할 때 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomBreadcrumb from '@component/navigation/CustomBreadcrumb';
 *
 * // 기본 경로
 * <CustomBreadcrumb
 *   items={[
 *     { title: '홈', href: '/' },
 *     { title: '사용자 관리' },
 *     { title: '사용자 목록' },
 *   ]}
 * />
 *
 * // 아이콘 포함
 * <CustomBreadcrumb
 *   items={[
 *     { title: <HomeOutlined />, href: '/' },
 *     { title: '권한 관리' },
 *     { title: '메뉴 관리' },
 *   ]}
 * />
 *
 * // 드롭다운 메뉴 포함
 * <CustomBreadcrumb
 *   items={[
 *     { title: '홈', href: '/' },
 *     {
 *       title: '관리',
 *       menu: {
 *         items: [
 *           { key: 'user', label: '사용자 관리' },
 *           { key: 'role', label: '권한 관리' },
 *         ],
 *       },
 *     },
 *     { title: '사용자 목록' },
 *   ]}
 * />
 */
import React from 'react';
import {Breadcrumb, BreadcrumbProps} from 'antd';

interface CustomBreadcrumbProps extends BreadcrumbProps {}

const CustomBreadcrumb = (props: CustomBreadcrumbProps) => {
    return (
        <Breadcrumb {...props} />
    );
};

export default CustomBreadcrumb;
