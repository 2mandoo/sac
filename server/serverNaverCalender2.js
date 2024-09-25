// 네이버 API - 캘린더 일정 추가하기
// npm i express cors request

const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request');

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));

app.post('/calendar', (req, res) => {
    const { TOKEN, UID, DTSTART, DTEND, SUMMARY, DESCRIPTION, LOCATION } = req.body;
    const header = "Bearer " + TOKEN;

    // ICAL 문자열 생성
    const scheduleIcalString = createScheduleIcalString(UID, DTSTART, DTEND, SUMMARY, DESCRIPTION, LOCATION);

    const options = {
        url: 'https://openapi.naver.com/calendar/createSchedule.json',
        form: {
            'calendarId': 'defaultCalendarId',
            'scheduleIcalString': scheduleIcalString
        },
        headers: {
            'Authorization': header
        }
    };

    request.post(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // 성공적으로 응답을 받았을 때
            res.json(body);
        } else {
            // 오류가 있을 때
            console.error('Error:', error || `Status Code: ${response.statusCode}`);

            // 오류 상태 코드 및 메시지 전송
            res.status(response ? response.statusCode : 500).json({
                error: error ? error.message : 'An unknown error occurred',
                status: response ? response.statusCode : 500
            });
        }
    });
});

// 일정 ICAL 문자열 생성 함수
function createScheduleIcalString(UID, DTSTART, DTEND, SUMMARY, DESCRIPTION, LOCATION) {
    const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, -5);

    // 각 매개변수의 기본값 설정
    const safeUID = UID || 'defaultUID';
    const safeDTSTART = DTSTART || now; // 기본 시작 시간
    const safeDTEND = DTEND || now; // 기본 종료 시간
    const safeSummary = SUMMARY || '기본 일정 제목';
    const safeDescription = DESCRIPTION || '일정에 대한 기본 설명입니다.';
    const safeLocation = LOCATION || '기본 위치';

    // UID 생성 (비어있는 경우 기본값 설정)
    const uid = safeUID + '_' + safeDTSTART + '_' + safeDTEND;

    // iCalendar 문자열 생성
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:Naver Calendar
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Asia/Seoul
BEGIN:STANDARD
DTSTART:19700101T000000
TZNAME:GMT+:00
TZOFFSETFROM:+0900
TZOFFSETTO:+0900
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
SEQUENCE:0
CLASS:PUBLIC
TRANSP:OPAQUE
UID:${uid}
DTSTART;TZID=Asia/Seoul:${safeDTSTART}
DTEND;TZID=Asia/Seoul:${safeDTEND}
SUMMARY:${safeSummary}
DESCRIPTION:${safeDescription}
LOCATION:${safeLocation}
CREATED:${now}Z
LAST-MODIFIED:${now}Z
DTSTAMP:${now}Z
END:VEVENT
END:VCALENDAR`;
}


// 서버 실행
app.listen(3000, () => {
    console.log('Server http://127.0.0.1:3000/calendar is running');
});
