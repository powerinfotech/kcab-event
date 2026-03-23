import React from 'react';
import { GuideSection, GuideDemoBox } from './GuideSection';

let Column: React.ComponentType<any> | null = null;
let Line: React.ComponentType<any> | null = null;
let Pie: React.ComponentType<any> | null = null;
let Area: React.ComponentType<any> | null = null;

try {
  const charts = require('@ant-design/charts');
  Column = charts.Column;
  Line = charts.Line;
  Pie = charts.Pie;
  Area = charts.Area;
} catch {
  // @ant-design/charts not installed
}

const barData = [
  { month: '1월', value: 380 },
  { month: '2월', value: 520 },
  { month: '3월', value: 610 },
  { month: '4월', value: 450 },
  { month: '5월', value: 780 },
  { month: '6월', value: 690 },
];

const lineData = [
  { month: '1월', category: '접속자', value: 120 },
  { month: '2월', category: '접속자', value: 230 },
  { month: '3월', category: '접속자', value: 310 },
  { month: '4월', category: '접속자', value: 280 },
  { month: '5월', category: '접속자', value: 420 },
  { month: '6월', category: '접속자', value: 380 },
  { month: '1월', category: '신규가입', value: 45 },
  { month: '2월', category: '신규가입', value: 68 },
  { month: '3월', category: '신규가입', value: 92 },
  { month: '4월', category: '신규가입', value: 55 },
  { month: '5월', category: '신규가입', value: 110 },
  { month: '6월', category: '신규가입', value: 85 },
];

const pieData = [
  { type: '개발팀', value: 45 },
  { type: '기획팀', value: 20 },
  { type: '디자인팀', value: 15 },
  { type: '인사팀', value: 12 },
  { type: '재무팀', value: 8 },
];

const areaData = [
  { month: '1월', value: 320 },
  { month: '2월', value: 480 },
  { month: '3월', value: 560 },
  { month: '4월', value: 420 },
  { month: '5월', value: 710 },
  { month: '6월', value: 630 },
];

const ChartsGuide = () => {
  if (!Column || !Line || !Pie || !Area) {
    return (
      <GuideSection id="charts" title="차트 / 시각화 (Charts)" description="@ant-design/charts 기반 차트 컴포넌트">
        <GuideDemoBox title="차트 라이브러리 미설치">
          <div className="guide-demo-description">
            @ant-design/charts 패키지가 설치되지 않았습니다.
            <br />npm install @ant-design/charts 를 실행하세요.
          </div>
        </GuideDemoBox>
      </GuideSection>
    );
  }

  return (
    <GuideSection id="charts" title="차트 / 시각화 (Charts)" description="@ant-design/charts 기반 차트 컴포넌트">
      <div className="guide-chart-row">
        {/* BarChart */}
        <GuideDemoBox title="BarChart (막대 차트)">
          <div className="guide-chart-container">
            <Column
              data={barData}
              xField="month"
              yField="value"
              colorField="month"
              label={{
                text: 'value',
                position: 'top',
              }}
            />
          </div>
        </GuideDemoBox>

        {/* LineChart */}
        <GuideDemoBox title="LineChart (꺾은선 차트)">
          <div className="guide-chart-container">
            <Line
              data={lineData}
              xField="month"
              yField="value"
              colorField="category"
              shapeField="smooth"
              point={{
                shapeField: 'point',
                sizeField: 4,
              }}
            />
          </div>
        </GuideDemoBox>
      </div>

      <div className="guide-chart-row">
        {/* PieChart */}
        <GuideDemoBox title="PieChart (원형 차트)">
          <div className="guide-chart-container">
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              label={{
                text: 'type',
                position: 'outside',
              }}
              interaction={{
                elementHighlight: true,
              }}
            />
          </div>
        </GuideDemoBox>

        {/* DoughnutChart */}
        <GuideDemoBox title="DoughnutChart (도넛 차트)">
          <div className="guide-chart-container">
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              innerRadius={0.6}
              label={{
                text: 'type',
                position: 'outside',
              }}
              interaction={{
                elementHighlight: true,
              }}
              annotations={[
                {
                  type: 'text',
                  style: {
                    text: '전체\n100',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                  },
                },
              ]}
            />
          </div>
        </GuideDemoBox>
      </div>

      {/* AreaChart */}
      <GuideDemoBox title="AreaChart (영역 차트)">
        <div className="guide-chart-container">
          <Area
            data={areaData}
            xField="month"
            yField="value"
            shapeField="smooth"
          />
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default ChartsGuide;
