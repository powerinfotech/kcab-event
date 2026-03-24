import React from 'react';
import {Drawer, DrawerProps} from 'antd';

interface CustomDrawerProps extends DrawerProps {}

const CustomDrawer = (props: CustomDrawerProps) => {
    return (
        <Drawer {...props} />
    );
};

export default CustomDrawer;
