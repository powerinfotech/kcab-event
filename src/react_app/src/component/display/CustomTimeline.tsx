import React from 'react';
import {Timeline, TimelineProps} from 'antd';

interface CustomTimelineProps extends TimelineProps {}

const CustomTimeline = (props: CustomTimelineProps) => {
    return (
        <Timeline {...props} />
    );
};

export default CustomTimeline;
