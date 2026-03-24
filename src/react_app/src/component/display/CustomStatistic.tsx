import React from 'react';
import {Statistic, StatisticProps} from 'antd';

interface CustomStatisticProps extends StatisticProps {}

const CustomStatistic = (props: CustomStatisticProps) => {
    return (
        <Statistic {...props} />
    );
};

export default CustomStatistic;
