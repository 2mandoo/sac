const fs = require('fs');

// JSON 파일 경로
const inputFileName = 'json/transformed_merged_info.json'; // 원본 JSON 파일
const outputFileName = 'json/data_50.json'; // 결과 JSON 파일

// JSON 파일 읽기
fs.readFile(inputFileName, 'utf-8', (err, data) => {
    if (err) {
        console.error('파일 읽기 오류:', err);
        return;
    }

    // JSON 파싱
    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        return;
    }

    // 상위 50개 객체 선택
    const top50 = jsonData.slice(0, 50);

    // 새로운 JSON 파일로 저장
    fs.writeFile(outputFileName, JSON.stringify(top50, null, 2), (writeError) => {
        if (writeError) {
            console.error('파일 쓰기 오류:', writeError);
        } else {
            console.log('상위 50개 객체가 output.json 파일에 저장되었습니다.');
        }
    });
});
