const fs = require('fs');

// JSON 파일 로드 (예시: json/api_age_data_all.json)
const filename = 'test2';
const jsonFileName = `json/${filename}.json`;
const outputFileName = `json/filtered_${filename}.json`;

// 날짜 형식 비교 함수 (YYYYMMDD~YYYYMMDD 형식 처리)
function getLatestPeriod(period1, period2) {
    const start1 = period1.split('~')[1];
    const start2 = period2.split('~')[1];

    // 더 나중 날짜를 반환 (날짜가 없으면 우선순위 낮음)
    return start1 > start2 ? period1 : period2;
}

// JSON 파일 로드 및 중복 제거 함수
async function filterAndSaveJSON() {
    try {
        // JSON 파일을 읽기
        const data = JSON.parse(fs.readFileSync(jsonFileName, 'utf-8'));

        // 원래 JSON 데이터의 길이 출력
        console.log(`정제 전 데이터 개수: ${data.length}`);

        // 중복된 title을 기준으로 최신 period만 남기기
        const filteredData = Object.values(data.reduce((acc, item) => {
            if (!acc[item.TITLE]) {
                acc[item.TITLE] = item;
            } else {
                // 중복된 title이 있으면 period가 최신인 것으로 대체
                acc[item.TITLE].PERIOD = getLatestPeriod(acc[item.TITLE].PERIOD, item.PERIOD);
            }
            return acc;
        }, {}));

        // 정제 후 JSON 데이터의 길이 출력
        console.log(`정제 후 데이터 개수: ${filteredData.length}`);

        // 정제된 데이터를 새 파일에 저장
        fs.writeFileSync(outputFileName, JSON.stringify(filteredData, null, 2), 'utf-8');
        console.log(`정제된 JSON 파일이 저장되었습니다: ${outputFileName}`);
    } catch (error) {
        console.error('JSON 파일 처리 중 오류가 발생했습니다:', error);
    }
}

// 함수 호출
filterAndSaveJSON();
