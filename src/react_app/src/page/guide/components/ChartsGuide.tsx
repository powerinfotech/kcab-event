import React from 'react';
import { GuideSection, GuideDemoBox } from './GuideSection';

let Column: React.ComponentType<any> | null = null;
let Line: React.ComponentType<any> | null = null;
let Pie: React.ComponentType<any> | null = null;
let Area: React.ComponentType<any> | null = null;
let Bar: React.ComponentType<any> | null = null;
let DualAxes: React.ComponentType<any> | null = null;
let Scatter: React.ComponentType<any> | null = null;
let Radar: React.ComponentType<any> | null = null;
let Gauge: React.ComponentType<any> | null = null;
let Waterfall: React.ComponentType<any> | null = null;

try {
  const charts = require('@ant-design/charts');
  Column = charts.Column;
  Line = charts.Line;
  Pie = charts.Pie;
  Area = charts.Area;
  Bar = charts.Bar;
  DualAxes = charts.DualAxes;
  Scatter = charts.Scatter;
  Radar = charts.Radar;
  Gauge = charts.Gauge;
  Waterfall = charts.Waterfall;
} catch {
  // @ant-design/charts not installed
}

/* ───────── 코드 예제 상수 ───────── */

const BAR_CHART_CODE = `import { Column } from '@ant-design/charts';

// ① 데이터 구조
const data = [
  { month: '1월', value: 380 },
  { month: '2월', value: 520 },
];

// ② 기본 설정
<Column
  data={data}
  xField="month"        // X축 필드
  yField="value"        // Y축 필드
  colorField="month"    // 색상 구분 필드
  label={{
    text: 'value',      // 라벨에 표시할 필드
    position: 'top',    // 라벨 위치
  }}
/>

// ── 주요 Config Props ──
// xField / yField   - 축 매핑 필드
// colorField        - 색상 구분 필드
// label             - 라벨 설정 { text, position }
// style             - 스타일 { fill, fillOpacity }`;

const LINE_CHART_CODE = `import { Line } from '@ant-design/charts';

// ① 다중 라인 데이터 구조
const data = [
  { month: '1월', category: '접속자', value: 120 },
  { month: '1월', category: '신규가입', value: 45 },
];

// ② 기본 설정
<Line
  data={data}
  xField="month"
  yField="value"
  colorField="category"   // 라인별 색상 구분
  shapeField="smooth"     // 부드러운 곡선
  point={{
    shapeField: 'point',
    sizeField: 4,
  }}
/>

// ── 주요 Config Props ──
// shapeField="smooth" - 곡선 처리
// colorField          - 다중 라인 구분
// point               - 포인트 표시 설정`;

const PIE_CHART_CODE = `import { Pie } from '@ant-design/charts';

// ① 데이터 구조
const data = [
  { type: '개발팀', value: 45 },
  { type: '기획팀', value: 20 },
];

// ② 기본 원형 차트
<Pie
  data={data}
  angleField="value"     // 각도 필드
  colorField="type"      // 색상 구분 필드
  label={{ text: 'type', position: 'outside' }}
  interaction={{ elementHighlight: true }}
/>

// ── 주요 Config Props ──
// angleField  - 비율 계산 필드
// colorField  - 색상 구분 필드
// label       - 라벨 설정 { text, position: 'outside'|'inside' }
// interaction - 인터랙션 { elementHighlight }`;

const DOUGHNUT_CHART_CODE = `import { Pie } from '@ant-design/charts';

// ① 도넛 차트 = Pie + innerRadius
<Pie
  data={data}
  angleField="value"
  colorField="type"
  innerRadius={0.6}        // 도넛 비율 (0~1)
  label={{ text: 'type', position: 'outside' }}
  annotations={[{
    type: 'text',
    style: {
      text: '전체\\n100',
      x: '50%', y: '50%',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
  }]}
/>

// ── 주요 Config Props ──
// innerRadius  - 도넛 내부 반지름 비율 (0.6 = 60%)
// annotations  - 중앙 텍스트 등 주석`;

const AREA_CHART_CODE = `import { Area } from '@ant-design/charts';

// ① 기본 설정
<Area
  data={data}
  xField="month"
  yField="value"
  shapeField="smooth"    // 부드러운 곡선
/>

// ── 주요 Config Props ──
// shapeField="smooth"  - 곡선 영역
// style                - 영역 스타일 { fill, fillOpacity }`;

const HORIZONTAL_BAR_CODE = `import { Bar } from '@ant-design/charts';

// ① 가로 막대 차트
<Bar
  data={data}
  xField="category"     // 카테고리 (세로축)
  yField="value"        // 값 (가로축)
  colorField="category"
  label={{
    text: 'value',
    position: 'right',  // 라벨 위치
  }}
/>

// ── 주요 Config Props ──
// Column과 동일하나 가로 방향으로 렌더링
// xField이 세로축, yField가 가로축`;

const DUAL_AXES_CODE = `import { DualAxes } from '@ant-design/charts';

// ① 데이터 구조 (하나의 배열에 두 축 데이터 포함)
const data = [
  { month: '1월', sales: 380, rate: 12.5 },
];

// ② 이중 축 설정
<DualAxes
  data={data}
  xField="month"
  children={[
    {
      type: 'interval',         // 막대
      yField: 'sales',
      style: { fillOpacity: 0.8 },
    },
    {
      type: 'line',             // 라인
      yField: 'rate',
      shapeField: 'smooth',
      style: { stroke: '#f04864', lineWidth: 2 },
      axis: { y: { position: 'right' } },
    },
  ]}
/>

// ── 주요 Config Props ──
// children  - 차트 시리즈 배열 [{ type, yField, axis }]
// type      - 'interval'(막대), 'line'(꺾은선)
// axis.y.position - 'right'로 오른쪽 축 사용`;

const SCATTER_CHART_CODE = `import { Scatter } from '@ant-design/charts';

// ① 데이터 구조
const data = [
  { x: 10, y: 25, category: 'A' },
];

// ② 기본 설정
<Scatter
  data={data}
  xField="x"
  yField="y"
  colorField="category"
  sizeField={5}
  shapeField="point"
/>

// ── 주요 Config Props ──
// sizeField   - 포인트 크기
// colorField  - 색상 구분 필드
// shapeField  - 포인트 모양`;

const RADAR_CHART_CODE = `import { Radar } from '@ant-design/charts';

// ① 데이터 구조
const data = [
  { item: '기술력', score: 85 },
  { item: '안정성', score: 70 },
];

// ② 기본 설정
<Radar
  data={data}
  xField="item"
  yField="score"
  area={{ style: { fillOpacity: 0.3 } }}
  point={{ sizeField: 4 }}
/>

// ── 주요 Config Props ──
// area   - 영역 채우기 { style: { fillOpacity } }
// point  - 꼭짓점 포인트 { sizeField }`;

const GAUGE_CHART_CODE = `import { Gauge } from '@ant-design/charts';

// ① 기본 설정
<Gauge
  data={{
    target: 75,       // 현재 값
    total: 100,       // 전체 값
    name: '달성률',
  }}
  legend={false}
/>

// ── 주요 Config Props ──
// data.target - 현재 값
// data.total  - 전체 값 (비율 계산)
// data.name   - 표시 이름
// legend      - 범례 표시 여부`;

const WATERFALL_CHART_CODE = `import { Waterfall } from '@ant-design/charts';

// ① 데이터 구조
const data = [
  { category: '매출', value: 1000 },
  { category: '인건비', value: -300 },
  { category: '순이익', value: 530, isTotal: true },
];

// ② 기본 설정
<Waterfall
  data={data}
  xField="category"
  yField="value"
/>

// ── 주요 Config Props ──
// isTotal  - 합계 항목 표시 (데이터에 포함)
// 양수는 증가, 음수는 감소로 자동 표현`;

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

const horizontalBarData = [
  { category: '서울', value: 1200 },
  { category: '부산', value: 850 },
  { category: '대구', value: 620 },
  { category: '인천', value: 580 },
  { category: '광주', value: 430 },
  { category: '대전', value: 390 },
];

const dualAxesData = [
  { month: '1월', sales: 380, rate: 12.5 },
  { month: '2월', sales: 520, rate: 15.2 },
  { month: '3월', sales: 610, rate: 18.1 },
  { month: '4월', sales: 450, rate: 14.3 },
  { month: '5월', sales: 780, rate: 22.6 },
  { month: '6월', sales: 690, rate: 19.8 },
];

const scatterData = [
  { x: 10, y: 25, category: 'A' },
  { x: 20, y: 45, category: 'A' },
  { x: 35, y: 55, category: 'A' },
  { x: 45, y: 35, category: 'B' },
  { x: 55, y: 70, category: 'B' },
  { x: 65, y: 60, category: 'B' },
  { x: 25, y: 80, category: 'C' },
  { x: 40, y: 65, category: 'C' },
  { x: 70, y: 90, category: 'C' },
];

const radarData = [
  { item: '기술력', score: 85 },
  { item: '안정성', score: 70 },
  { item: '확장성', score: 90 },
  { item: '보안', score: 75 },
  { item: '성능', score: 80 },
  { item: '사용성', score: 65 },
];

const waterfallData = [
  { category: '매출', value: 1000 },
  { category: '인건비', value: -300 },
  { category: '운영비', value: -150 },
  { category: '마케팅', value: -100 },
  { category: '기타수익', value: 80 },
  { category: '순이익', value: 530, isTotal: true },
];

const ChartsGuide = () => {
  if (!Column || !Line || !Pie || !Area || !Bar || !DualAxes || !Scatter || !Radar || !Gauge || !Waterfall) {
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
        <GuideDemoBox title="BarChart (막대 차트)" codeExample={BAR_CHART_CODE}>
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
        <GuideDemoBox title="LineChart (꺾은선 차트)" codeExample={LINE_CHART_CODE}>
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
        <GuideDemoBox title="PieChart (원형 차트)" codeExample={PIE_CHART_CODE}>
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
        <GuideDemoBox title="DoughnutChart (도넛 차트)" codeExample={DOUGHNUT_CHART_CODE}>
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
      <GuideDemoBox title="AreaChart (영역 차트)" codeExample={AREA_CHART_CODE}>
        <div className="guide-chart-container">
          <Area
            data={areaData}
            xField="month"
            yField="value"
            shapeField="smooth"
          />
        </div>
      </GuideDemoBox>

      <div className="guide-chart-row">
        {/* Bar (가로 막대) */}
        <GuideDemoBox title="BarChart (가로 막대 차트)" codeExample={HORIZONTAL_BAR_CODE}>
          <div className="guide-chart-container">
            <Bar
              data={horizontalBarData}
              xField="category"
              yField="value"
              colorField="category"
              label={{
                text: 'value',
                position: 'right',
              }}
            />
          </div>
        </GuideDemoBox>

        {/* DualAxes (이중 축) */}
        <GuideDemoBox title="DualAxes (이중 축 차트)" codeExample={DUAL_AXES_CODE}>
          <div className="guide-chart-container">
            <DualAxes
              data={dualAxesData}
              xField="month"
              children={[
                {
                  type: 'interval',
                  yField: 'sales',
                  style: { fillOpacity: 0.8 },
                },
                {
                  type: 'line',
                  yField: 'rate',
                  shapeField: 'smooth',
                  style: { stroke: '#f04864', lineWidth: 2 },
                  axis: { y: { position: 'right' } },
                },
              ]}
            />
          </div>
        </GuideDemoBox>
      </div>

      <div className="guide-chart-row">
        {/* Scatter (산점도) */}
        <GuideDemoBox title="ScatterChart (산점도)" codeExample={SCATTER_CHART_CODE}>
          <div className="guide-chart-container">
            <Scatter
              data={scatterData}
              xField="x"
              yField="y"
              colorField="category"
              sizeField={5}
              shapeField="point"
            />
          </div>
        </GuideDemoBox>

        {/* Radar (레이더) */}
        <GuideDemoBox title="RadarChart (레이더 차트)" codeExample={RADAR_CHART_CODE}>
          <div className="guide-chart-container">
            <Radar
              data={radarData}
              xField="item"
              yField="score"
              area={{
                style: { fillOpacity: 0.3 },
              }}
              point={{
                sizeField: 4,
              }}
            />
          </div>
        </GuideDemoBox>
      </div>

      <div className="guide-chart-row">
        {/* Gauge (게이지) */}
        <GuideDemoBox title="Gauge (게이지 차트)" codeExample={GAUGE_CHART_CODE}>
          <div className="guide-chart-container">
            <Gauge
              data={{
                target: 75,
                total: 100,
                name: '달성률',
              }}
              legend={false}
            />
          </div>
        </GuideDemoBox>

        {/* Waterfall (워터폴) */}
        <GuideDemoBox title="WaterfallChart (워터폴 차트)" codeExample={WATERFALL_CHART_CODE}>
          <div className="guide-chart-container">
            <Waterfall
              data={waterfallData}
              xField="category"
              yField="value"
            />
          </div>
        </GuideDemoBox>
      </div>
    </GuideSection>
  );
};

export default ChartsGuide;
