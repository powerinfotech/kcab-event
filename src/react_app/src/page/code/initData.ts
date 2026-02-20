import {EventStateListItem} from '@interface/code/EventState';
import {SensorListItem} from '@interface/code/Sensor';

export const eventStateList:EventStateListItem[] = [
    {
        data1: '베터리',
        data2: '잔량부족',
        data3: '',
        data4: '',
        eventType:'battery',
        unqKey:1
    },
    {
        data1: '온습도',
        data2: '폭염주의',
        data3: '',
        data4: '폭염 온도 알람 기준값 이상이면 폭염주의',
        eventType:'thermometerHalf',
        unqKey:2
    },
    {
        data1: '온습도',
        data2: '한파주의',
        data3: '',
        data4: '온도 알람 기준값 이하면 한파주의',
        eventType:'thermometerHalf',
        unqKey:3
    },
    {
        data1: '온습도',
        data2: '건조주의',
        data3: '',
        data4: '',
        eventType:'thermometerHalf',
        unqKey:4
    },
    {
        data1: 'GPS',
        data2: '위치이동',
        data3: '',
        data4: '',
        eventType:'gps',
        unqKey:5
    },
    {
        data1: '기울기',
        data2: '기울어짐',
        data3: '',
        data4: '',
        eventType:'angle',
        unqKey:6
    },
    {
        data1: '충격',
        data2: '충격발생',
        data3: '',
        data4: '',
        eventType:'impact',
        unqKey:7
    },
    {
        data1: '음성',
        data2: '허용시간 외 등산객감지',
        data3: '',
        data4: '',
        eventType:'sound',
        unqKey:8
    },
    {
        data1: '음성',
        data2: '등산객 구조요청 감지',
        data3: '',
        data4: '',
        eventType:'sound',
        unqKey:9
    },
    {
        data1: '비상스위치',
        data2: '구조요청',
        data3: '',
        data4: '',
        eventType:'switch',
        unqKey:10
    },
];

// export const sensorPackList :SensorPackListItem[] = [
//     {
//         data1: '사고 다발지역',
//         data2: '국가 지점번호',
//         data3: '다목적 위치',
//         data4: '센서팩 일련번호',
//         data5:'관리기관',
//         data6: true,
//     },
//     {
//         data1: '사고 다발지역2',
//         data2: '국가 지점번호2',
//         data3: '다목적 위치2',
//         data4: '센서팩 일련번호2',
//         data5:'관리기관2',
//         data6: false
//     },
// ];

export const sensorList :SensorListItem[] = [
    // {
    //     data1: '베터리',
    //     data2: '1',
    //     data3: '',
    //     data4: '30%',
    //     data5:'설명입니다.',
    //     eventType:'battery',
    //     unqKey:1,
    // },
    // {
    //     data1: '베터리',
    //     data2: '2',
    //     data3: '',
    //     data4: '35%',
    //     data5:'설명입니다.',
    //     eventType:'battery',
    //     unqKey:2
    // },
    // {
    //     data1: '온습도',
    //     data2: '온도',
    //     data3: '상현',
    //     data4: '50 도',
    //     data5:'설명입니다.',
    //     eventType:'thermometerHalf',
    //     unqKey:3
    // },
    // {
    //     data1: '온습도',
    //     data2: '온도',
    //     data3: '하현',
    //     data4: '15 도',
    //     data5:'설명입니다.',
    //     eventType:'thermometerHalf',
    //     unqKey:4
    // },
    // {
    //     data1: '온습도',
    //     data2: '습도',
    //     data3: '상한',
    //     data4: '70%',
    //     data5:'설명입니다.',
    //     eventType:'thermometerHalf',
    //     unqKey:5
    // },
    // {
    //     data1: '온습도',
    //     data2: '습도',
    //     data3: '하안',
    //     data4: '25%',
    //     data5:'설명입니다.',
    //     eventType:'thermometerHalf',
    //     unqKey:6
    // },
    // {
    //     data1: 'GPS',
    //     data2: '경도',
    //     data3: '',
    //     data4: '',
    //     data5:'설명입니다.',
    //     eventType:'gps',
    //     unqKey:7
    // },
    // {
    //     data1: 'GPS',
    //     data2: '위도',
    //     data3: '',
    //     data4: '',
    //     data5:'설명입니다.',
    //     eventType:'gps',
    //     unqKey:8
    // },
    // {
    //     data1: '기울기',
    //     data2: 'X',
    //     data3: '',
    //     data4: '',
    //     data5:'설명입니다.',
    //     eventType:'slope',
    //     unqKey:9
    // },
    // {
    //     data1: '기울기',
    //     data2: 'Y',
    //     data3: '',
    //     data4: '',
    //     data5:'설명입니다.',
    //     eventType:'slope',
    //     unqKey:10
    // },
    // {
    //     data1: '기울기',
    //     data2: 'Z',
    //     data3: '',
    //     data4: '',
    //     data5:'설명입니다.',
    //     eventType:'slope',
    //     unqKey:11
    // },
    // {
    //     data1: '충격',
    //     data2: '',
    //     data3: '80%',
    //     data4: '',
    //     data5:'설명입니다.',
    //     eventType:'impact',
    //     unqKey:12
    // },
];