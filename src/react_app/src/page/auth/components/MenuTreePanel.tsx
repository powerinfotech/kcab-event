import React from 'react';
import {Tree} from 'antd';
import CustomButton from '@component/button/CustomButton';
import IconTitle from '@icon/IconTitle';
import {MenuTree} from '@interface/auth/MenuManagement';

const {DirectoryTree} = Tree;

interface MenuTreePanelProps {
    treeData?: MenuTree[];
    expandedKey?: React.Key[];
    selectedKeys: any[];
    selectable: boolean;
    onSelect: (keys: any[]) => void;
    onExpand: (keys: any[], info: any) => void;
    onExpandAll: () => void;
    onFoldAll: () => void;
}

const MenuTreePanel: React.FC<MenuTreePanelProps> = ({
    treeData,
    expandedKey,
    selectedKeys,
    selectable,
    onSelect,
    onExpand,
    onExpandAll,
    onFoldAll,
}) => {
    return (
        <div>
            <div className="board-title-wrap">
                <h3 className="title">
                    <IconTitle/>
                    메뉴목록
                </h3>
                <div className="box-btn">
                    <CustomButton type="default" size="small" onClick={onFoldAll}>접기</CustomButton>
                    <CustomButton type="default" size="small" onClick={onExpandAll}>펼치기</CustomButton>
                </div>
            </div>
            <div className="board-cont-wrap">
                {treeData ? (
                    <DirectoryTree
                        showLine
                        multiple
                        defaultExpandAll
                        showIcon={true}
                        expandAction={'doubleClick'}
                        expandedKeys={expandedKey}
                        onSelect={onSelect}
                        onExpand={onExpand}
                        treeData={treeData}
                        selectable={selectable}
                        selectedKeys={selectedKeys}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default MenuTreePanel;
