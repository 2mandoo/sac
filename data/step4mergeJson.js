const fs = require('fs');

// 파일 경로
const ageFileName = 'json/filtered_api_age.json';   // age.json 파일 경로
const infoFileName = 'json/filtered_api_info.json'; // info.json 파일 경로
const outputFileName = 'json/merged_info.json'; // 결과를 저장할 파일 경로

// JSON 파일 로드 및 병합 함수
async function mergeJSONFiles() {
    try {
        // JSON 파일 읽기
        const ageData = JSON.parse(fs.readFileSync(ageFileName, 'utf-8'));
        const infoData = JSON.parse(fs.readFileSync(infoFileName, 'utf-8'));
        console.log(`ageData 데이터 개수: ${ageData.length}`);
        console.log(`infoData 데이터 개수: ${infoData.length}`);
        // TITLE을 키로 하는 맵 생성
        const ageMap = {};
        ageData.forEach(item => {
            ageMap[item.TITLE] = item; // TITLE을 키로 하여 age 객체 저장
        });

        // infoData의 객체를 순회하며 TITLE이 같은 객체만 병합
        const mergedData = infoData.reduce((acc, item) => {
            const matchingAgeItem = ageMap[item.TITLE];

            if (matchingAgeItem) {
                // RELATION 추가
                acc.push({
                    ...item,
                    RELATION: matchingAgeItem.RELATION,
                });
            }

            return acc; // 일치하는 객체만 추가
        }, []);

        console.log(`mergedData 데이터 개수: ${mergedData.length}`);
        // 병합된 데이터 저장
        fs.writeFileSync(outputFileName, JSON.stringify(mergedData, null, 2), 'utf-8');
        console.log(`병합된 JSON 파일이 저장되었습니다: ${outputFileName}`);
    } catch (error) {
        console.error('JSON 파일 처리 중 오류가 발생했습니다:', error);
    }
}

// 함수 호출
mergeJSONFiles();
