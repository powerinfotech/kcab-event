/**
 * CustomDrawer - Ant Design Drawer 래퍼 컴포넌트
 *
 * [목적]
 * 화면 측면에서 슬라이드 형태로 등장하는 패널을 표시할 때 사용한다.
 * 상세 조회, 필터 패널, 폼 입력 등에 활용한다.
 *
 * [사용 방법]
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <CustomButton onClick={() => setOpen(true)}>상세 보기</CustomButton>
 *
 * <CustomDrawer
 *   title="사용자 상세"
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   size="default"
 * >
 *   <p>상세 내용</p>
 * </CustomDrawer>
 */
import React from 'react';
import {Drawer, DrawerProps} from 'antd';

interface CustomDrawerProps extends DrawerProps {}

const CustomDrawer = (props: CustomDrawerProps) => {
    return (
        <Drawer {...props} />
    );
};

export default CustomDrawer;
