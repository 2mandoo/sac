
function openNaverLogin() {
    const url = 'naverlogin/naverlogin.html'; // 열고자 하는 페이지
    const windowName = 'NaverLogin'; // 창 이름
    const windowFeatures = 'width=500,height=600,left=100,top=100'; // 창 크기 및 위치 설정

    window.open(url, windowName, windowFeatures);
}

function getToken() {
    const name = 'naver_access_token';
    // 모든 쿠키를 문자열로 가져옴
    const cookies = document.cookie;

    // 쿠키를 세미콜론으로 분리하여 배열로 만듦
    const cookieArray = cookies.split(';');

    // 배열의 각 쿠키에 대해 순회
    for (let i = 0; i < cookieArray.length; i++) {
        // 각 쿠키에서 앞뒤 공백을 제거
        const cookie = cookieArray[i].trim();

        // 쿠키의 이름이 찾고자 하는 이름과 일치하면 값을 반환
        if (cookie.startsWith(name + '=')) {
            // "name=value" 형식에서 "value" 부분만 추출
            return cookie.substring(name.length + 1);
        }
    }

    // 해당하는 쿠키가 없으면 null 반환
    return null;
}

//일정추가 버튼
function addCalendarEvent() {
    //쿠키에서 토큰 가져오기
    const token = getToken();

    //토큰 없으면 로그인 페이지로 보냄
    if (!token) {
        openNaverLogin();
        return;
    }

    //스케줄 데이터 세팅
    const result = convertToDateTimeRange(parsedData.PERIOD, parsedData.EVENT_PERIOD);

    const scheduleData = {
        TOKEN: token,
        UID: data.key,
        DTSTART: result.DTSTART,
        DTEND: result.DTEND,
        SUMMARY: parsedData.TITLE,
        DESCRIPTION: parsedData.CONTACT_POINT,
        LOCATION: '예술의전당'
    };

    //console.log("scheduleData: ", scheduleData);
    const isConfirmed = confirm(`네이버 캘린더에 일정을 추가하시겠습니까?\n\n제목: ${scheduleData.SUMMARY}\n기간: ${scheduleData.DTSTART} ~ ${scheduleData.DTEND}\n장소: ${scheduleData.LOCATION}`);
    if (!isConfirmed) return;


    // 서버에 캘린더 스케줄 추가 요청 보내기
    fetch('http://127.0.0.1:3000/calendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(scheduleData)
    })
    .then(response => response.json())  // 응답을 JSON으로 파싱
    .then(response => {
        const result = JSON.parse(response); // 수동으로 JSON 파싱
        if (result.result == "success") {
            console.log('Success: ', result);
            alert('일정 추가가 완료되었습니다!');
        } else {

            console.log('Fail: ', result);

            if (result.code == 409) {
                alert('이미 추가한 일정입니다.');
            } else {
                alert(`일정 추가 실패: 관리자에게 문의하세요. (오류 코드: ${result.code})`);
            }
        }

    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function convertToDateTimeRange(dateRange, startTime) {
    // dateRange를 시작일과 종료일로 분리
    const [startDate, endDate] = dateRange.split('~').map(date => date.trim());

    // 시간(HH:MM)을 HHMMSS 포맷으로 변환
    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        return `T${hours}${minutes}00`;  // 초를 '00'으로 설정
    }

    const time = formatTime(startTime);
    // 날짜에서 '-'를 제거하고, 변환된 시간을 추가
    const startDateTime = startDate.replace(/-/g, '') + time;
    const endDateTime = endDate.replace(/-/g, '') + time;

    return {
        DTSTART: startDateTime,  // 시작 시간
        DTEND: endDateTime       // 종료 시간
    };
}


