const fs = require('fs');

// JSON 파일 로드 (예시: merged_info.json)
const filename = 'merged_info';
const jsonFileName = `json/${filename}.json`;
const outputFileName = `json/transformed_${filename}.json`;

// "RELATION": "10대 이하 : 0건, 20대 : 17건, 30대 : 7건, 40대 : 0건, 50대 : 1건, 60대 : 1건, 70대 이상 : 0건 )"
// RELATION 문자열을 객체로 변환하는 함수
function transformRelation(relationString) {
    const relationEntries = relationString
        .replace(')', '') // 마지막 괄호 제거
        .split(',') // 쉼표로 나누기
        .map(entry => {
            const [ageGroup, count] = entry.split(':').map(item => item.trim());
            return { [ageGroup]: parseInt(count.replace('건', '').trim()) };
        });

    return Object.assign({}, ...relationEntries);
}

// JSON 파일 로드 및 변환 함수 호출
async function transformAndSaveJSON() {
    try {
        // JSON 파일을 읽기
        const data = JSON.parse(fs.readFileSync(jsonFileName, 'utf-8'));

        // 변환된 데이터 배열
        const transformedData = data.map(item => {
            const relationObject = transformRelation(item.RELATION);
            return { ...item, RELATION: relationObject };
        });

        // 변환된 데이터를 새 파일에 저장
        fs.writeFileSync(outputFileName, JSON.stringify(transformedData, null, 2), 'utf-8');
        console.log(`변환된 JSON 파일이 저장되었습니다: ${outputFileName}`);
    } catch (error) {
        console.error('JSON 파일 처리 중 오류가 발생했습니다:', error);
    }
}

// 함수 호출
transformAndSaveJSON();
