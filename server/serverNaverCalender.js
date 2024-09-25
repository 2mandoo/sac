// 네이버 API 예제 - 캘린더 일정 추가하기
// npm i express cors request
var express = require('express');
var app = express();

const cors = require('cors');
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));

app.post('/calendar', function (req, res) {

    const { TOKEN, UID, DTSTART, DTEND, SUMMARY, DESCRIPTION, LOCATION } = req.body;
    const header = "Bearer " + TOKEN;
    const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, -5);
    const uid = UID + '_' + DTSTART + '_' + DTEND;

    const scheduleIcalString =
        `BEGIN:VCALENDAR
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
DTSTART;TZID=Asia/Seoul:${DTSTART}
DTEND;TZID=Asia/Seoul:${DTEND}
SUMMARY:${SUMMARY}
DESCRIPTION:${DESCRIPTION}
LOCATION:${LOCATION}
CREATED:${now}Z
LAST-MODIFIED:${now}Z
DTSTAMP:${now}Z
END:VEVENT
END:VCALENDAR`;


    var api_url = 'https://openapi.naver.com/calendar/createSchedule.json';
    var request = require('request');

    var options = {
        url: api_url,
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

app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/calendar app listening on port 3000!');
});