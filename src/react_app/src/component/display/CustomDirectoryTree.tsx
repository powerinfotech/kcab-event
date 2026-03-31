/**
 * CustomDirectoryTree - Ant Design Tree.DirectoryTree 래퍼 컴포넌트
 *
 * [목적]
 * 폴더 구조 형태의 트리를 표시할 때 사용한다.
 * 메뉴 트리, 카테고리 트리 등에 활용한다.
 *
 * [사용 방법]
 * @example
 * import CustomDirectoryTree from '@component/display/CustomDirectoryTree';
 *
 * const treeData = [
 *   {
 *     title: '관리자 메뉴',
 *     key: '0',
 *     children: [
 *       { title: '사용자 관리', key: '0-0', isLeaf: true },
 *       { title: '권한 관리', key: '0-1', isLeaf: true },
 *     ],
 *   },
 * ];
 *
 * <CustomDirectoryTree
 *   treeData={treeData}
 *   onSelect={(keys, info) => setSelectedKey(keys[0])}
 *   defaultExpandAll
 * />
 */
import React from 'react';
import {Tree} from 'antd';
import type {DirectoryTreeProps} from 'antd/es/tree';

interface CustomDirectoryTreeProps extends DirectoryTreeProps {}

const CustomDirectoryTree = (props: CustomDirectoryTreeProps) => {
    return (
        <Tree.DirectoryTree {...props} />
    );
};

export default CustomDirectoryTree;
