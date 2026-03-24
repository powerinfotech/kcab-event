import React from 'react';
import {Card, CardProps} from 'antd';

interface CustomCardProps extends CardProps {}

const CustomCard = (props: CustomCardProps) => {
    return (
        <Card {...props} />
    );
};

export default CustomCard;
