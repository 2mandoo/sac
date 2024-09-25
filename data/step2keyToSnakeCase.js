const fs = require('fs');

const inputFileName = 'json/test2.json'; // 입력 파일 이름
const outputFileName = 'json/test2.json'; // 출력 파일 이름

// 두 API가 키 표기법이 다름. 
// VIEW_COUNT (스네이크)
// viewCount (카멜)

// 키 변환 함수
function convertKeysToSnakeCase(obj) {
    const newObj = {};

    for (const key in obj) {
        // 키를 대문자 스네이크 표기법으로 변환
        const newKey = key
            .replace(/([a-z])([A-Z])/g, '$1_$2') // 카멜 표기법을 스네이크로 변환
            .toUpperCase(); // 대문자로 변환

        newObj[newKey] = obj[key];
    }

    return newObj;
}

// JSON 파일 로드 및 변환 함수
async function convertJSONKeys() {
    try {
        // JSON 파일을 읽기
        const data = JSON.parse(fs.readFileSync(inputFileName, 'utf-8'));

        // 객체를 배열로 변환
        const dataArray = Object.values(data);

        // 변환된 데이터 저장
        const convertedData = dataArray.map(convertKeysToSnakeCase); // dataArray 각 객체에 대해 convertKeysToSnakeCase 함수 호출

        console.log(` 데이터 개수: ${convertedData.length}`);
        // 변환된 데이터를 새 파일에 저장
        fs.writeFileSync(outputFileName, JSON.stringify(convertedData, null, 2), 'utf-8');
        console.log(`변환된 JSON 파일이 저장되었습니다: ${outputFileName}`);
    } catch (error) {
        console.error('JSON 파일 처리 중 오류가 발생했습니다:', error);
    }
}

// 함수 호출
convertJSONKeys();